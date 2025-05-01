import axios from 'axios';

const sendMessage = async () => {
 const params = {
    num: '03228042703',
    msg: 'Karigar OTP:123',
    auth: 'CRM-ABDULAHAD',
  };

  try {
    const response = await axios.get(`https://senlogix.duckdns.org/send-message?num=${params.num}&msg=${params.msg}&auth=${params.auth}`)
    .then((res) => {
      console.log('Response:', res.data);
    })
    .catch((error) => {
      console.error('Error:', error.response?.data || error.message);
    });
  } catch (error) {
    console.error('❌ Error sending message:', error.response?.data || error.message);
  }
};

sendMessage();
