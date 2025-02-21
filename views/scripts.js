document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('feedbackForm');
  
    form.addEventListener('submit', async function(event) {
      event.preventDefault();
  
      const formData = new FormData(form);
      const data = {
        question1: formData.get('question1'),
      };
  
      try {
        const response = await fetch('/submitFeedback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
  
        if (response.ok) {
          console.log('Feedback submitted successfully');
        } else {
          console.error('Error submitting feedback');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    });
  });
  