CREATE SCHEMA IF NOT EXISTS bb_ecommerce_sc;

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PAYMENT ORDERS
-- Manages the intent to pay, mapped to the internal e-commerce order. 
-- In Razorpay, this corresponds to the "Order ID" generated before the actual payment.
CREATE TABLE bb_ecommerce_sc.payment_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    internal_order_id VARCHAR(100) NOT NULL, -- Refers to your e-commerce order ID
    gateway_order_id VARCHAR(100) UNIQUE,    -- Razorpay Order ID (e.g. order_Ilu01...)
    gateway_provider VARCHAR(50) DEFAULT 'razorpay',
    amount DECIMAL(10, 2) NOT NULL,          -- Important: Store exact decimal amount
    currency VARCHAR(10) DEFAULT 'INR',
    status VARCHAR(50) NOT NULL DEFAULT 'created', -- 'created', 'attempted', 'paid', 'failed'
    customer_email VARCHAR(255),
    customer_phone VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. PAYMENT TRANSACTIONS
-- Tracks each payment attempt against an order. One order could have multiple
-- transactions if the first attempt fails.
CREATE TABLE bb_ecommerce_sc.payment_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payment_order_id UUID REFERENCES bb_ecommerce_sc.payment_orders(id) ON DELETE CASCADE,
    gateway_transaction_id VARCHAR(100) UNIQUE, -- Razorpay Payment ID (e.g. pay_29QQoUBi66zb5)
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    status VARCHAR(50) NOT NULL,                -- 'created', 'authorized', 'captured', 'refunded', 'failed'
    method VARCHAR(50),                         -- 'card', 'netbanking', 'wallet', 'emi', 'upi'
    method_details JSONB,                       -- Store nested tracking info: card network, last 4 digits, bank name, etc.
    error_code VARCHAR(100),                    -- 'BAD_REQUEST_ERROR', etc.
    error_description TEXT,                     -- 'Payment failed due to insufficient funds'
    gateway_response JSONB,                     -- Complete JSON response for debugging
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. WEBHOOK EVENTS
-- Vital for reliably recording asynchronously sent events from the payment gateway (e.g. payment.captured).
CREATE TABLE bb_ecommerce_sc.payment_webhooks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gateway_provider VARCHAR(50) DEFAULT 'razorpay',
    event_type VARCHAR(100) NOT NULL,           -- 'payment.captured', 'order.paid', 'refund.processed'
    gateway_event_id VARCHAR(100) UNIQUE,       -- Ensures idempotency (preventing duplicate webhook processing)
    payload JSONB NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',       -- 'pending', 'processed', 'failed'
    processing_error TEXT,                      -- If the webhook handler threw an error
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP WITH TIME ZONE
);

-- 4. REFUNDS
-- Tracks any partial or full refunds initiated via the gateway.
CREATE TABLE bb_ecommerce_sc.payment_refunds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payment_transaction_id UUID REFERENCES bb_ecommerce_sc.payment_transactions(id) ON DELETE CASCADE,
    gateway_refund_id VARCHAR(100) UNIQUE,      -- Razorpay Refund ID
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    status VARCHAR(50) NOT NULL,                -- 'pending', 'processed', 'failed'
    reason VARCHAR(255),                        -- 'Customer request', 'Items out of stock'
    gateway_response JSONB,                     -- Complete raw JSON response
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. SETTLEMENTS
-- Maps to when the money is actually deposited into your nodal/business bank account.
CREATE TABLE bb_ecommerce_sc.payment_settlements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gateway_settlement_id VARCHAR(100) UNIQUE,  -- Razorpay Settlement ID
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    fees DECIMAL(10, 2) NOT NULL DEFAULT 0.00,  -- Gateway processing fees taken
    tax DECIMAL(10, 2) NOT NULL DEFAULT 0.00,   -- GST/Taxes on the fees
    status VARCHAR(50) NOT NULL,                -- 'created', 'processed', 'failed'
    details JSONB,                              -- UTR number and raw parameters 
    settled_at TIMESTAMP WITH TIME ZONE,        -- Time at which it hit the bank
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. AUDIT LOGS
-- Complete ledger of who performed what action over a payment order (compliance).
CREATE TABLE bb_ecommerce_sc.payment_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_type VARCHAR(50) NOT NULL,           -- 'order', 'transaction', 'refund'
    entity_id UUID NOT NULL,                    -- ID linking back to the record
    action VARCHAR(100) NOT NULL,               -- 'status_changed', 'refund_initiated', 'order_created'
    performed_by VARCHAR(100),                  -- System, Webhook, or Admin User ID
    changes JSONB,                              -- e.g. {"old_status": "authorized", "new_status": "captured"}
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add helper indices for performance on high-read columns
CREATE INDEX idx_payment_orders_gateway_id ON bb_ecommerce_sc.payment_orders(gateway_order_id);
CREATE INDEX idx_payment_transactions_order_id ON bb_ecommerce_sc.payment_transactions(payment_order_id);
CREATE INDEX idx_payment_transactions_gateway_id ON bb_ecommerce_sc.payment_transactions(gateway_transaction_id);
CREATE INDEX idx_payment_webhooks_status ON bb_ecommerce_sc.payment_webhooks(status);
CREATE INDEX idx_payment_refunds_gateway_id ON bb_ecommerce_sc.payment_refunds(gateway_refund_id);
CREATE INDEX idx_payment_settlements_gateway_id ON bb_ecommerce_sc.payment_settlements(gateway_settlement_id);
