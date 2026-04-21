document.getElementById('payment-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    // Get form values
    const cardholder = document.getElementById('cardholder').value.trim();
    const cardnumber = document.getElementById('cardnumber').value.trim();
    const expiry = document.getElementById('expiry').value.trim();
    const cvv = document.getElementById('cvv').value.trim();
    const messageDiv = document.getElementById('message');

    // Validation
    if (!cardholder || !cardnumber || !expiry || !cvv) {
        showMessage('Please fill in all fields', 'error');
        return;
    }

    if (cardnumber.replace(/\s/g, '').length !== 16) {
        showMessage('Card number must be 16 digits', 'error');
        return;
    }

    if (cvv.length !== 3) {
        showMessage('CVV must be 3 digits', 'error');
        return;
    }

    if (!expiry.match(/^\d{2}\/\d{4}$/)) {
        showMessage('Expiry date must be MM/YYYY format', 'error');
        return;
    }

    // Disable button during processing
    const button = document.querySelector('.btn-complete');
    button.disabled = true;
    button.textContent = 'Processing...';

    try {
        // Send request to ESP32 to turn on LED
        const response = await fetch('http://192.168.4.75:80/led/on', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                status: 'on',
                timestamp: new Date().toISOString()
            })
        });

        if (response.ok) {
            showMessage('✓ Transaction completed successfully! LED activated.', 'success');
            document.getElementById('payment-form').reset();
            setTimeout(() => {
                messageDiv.classList.remove('success', 'error');
                messageDiv.style.display = 'none';
            }, 3000);
        } else {
            showMessage('Transaction completed but LED control may have failed', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('Error: Could not connect to device. Please try again.', 'error');
    } finally {
        button.disabled = false;
        button.textContent = 'Complete Transaction';
    }
});

function showMessage(text, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = text;
    messageDiv.className = 'message ' + type;
    messageDiv.style.display = 'block';
}