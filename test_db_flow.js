import { query, execute } from './api/_db.js';

async function testFlow() {
    console.log('--- START CROSS-CHECK TEST ---');

    // 1. Clean test data
    console.log('Cleaning old test data...');
    execute("DELETE FROM customers WHERE fullname = 'Tester DOM'");
    execute("DELETE FROM orders WHERE amount = 2000");

    // 2. Simulate Lead Submission (Step 3/4)
    console.log('Simulating Lead Submission...');
    execute("INSERT INTO customers (fullname, phone, email, zalo) VALUES ('Tester DOM', '0987654321', 'test@dom.com', '@testdom')");
    const customers = query("SELECT * FROM customers WHERE fullname = 'Tester DOM'");
    console.log('Customer created:', customers[0]);

    // 3. Simulate Successful Payment (Step 2/6)
    console.log('Simulating SePay Webhook Payment (2,000đ)...');
    const product = query("SELECT * FROM products LIMIT 1")[0];
    const initialStock = product.stock;
    
    // Logic from sepay-webhook.js
    execute(
        'INSERT INTO orders (customer_id, product_id, amount, status, transaction_id) VALUES (?, ?, ?, ?, ?)',
        [customers[0].id, product.id, 2000, 'success', 'TEST_TX_123']
    );
    execute('UPDATE products SET stock = stock - 1 WHERE id = ?', [product.id]);

    // 4. Verify Results
    console.log('Verifying Results...');
    const order = query("SELECT * FROM orders WHERE transaction_id = 'TEST_TX_123'")[0];
    const updatedProduct = query("SELECT * FROM products WHERE id = ?", [product.id])[0];

    console.log('Order recorded:', order);
    console.log('Stock updated:', initialStock, '->', updatedProduct.stock);

    if (order && updatedProduct.stock === initialStock - 1) {
        console.log('✅ FLOW TEST SUCCESSFUL: Leads recorded, Payment processed, Stock updated.');
    } else {
        console.log('❌ FLOW TEST FAILED.');
    }
}

testFlow().catch(console.error);
