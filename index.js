const cron = require('node-cron');
let global = [{}];
cron.schedule('*/30 * * * * *', async () => {
    let arr = ['Timestamp', 'Name', 'Email', 'Description', 'Contact'];
    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbyaeJoFaoAj3ULpB0f2G-ug_A-3zB-xB9Nt_abuliUz5B2VUbW52Mpf0hQWPOIjjhyalA/exec');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        let result = await response.json();
        result = result.content;
        let formateData = []
        result.unshift(arr)
        for (let i = 1; i < result.length; i++) {
            let obj = {};
            let currentRow = result[i];
            for (let j = 0; j < currentRow.length; j++) {
                obj[result[0][j]] = currentRow[j];
            }
            formateData.push(obj);
        }
        // if (global.length === 0) {
        //     global.push(global)
        // }
        // else {
        //     const uniqueObjects = global.reduce((acc, current) => {
        //         const existingObject = acc.find(obj => obj.Email === current.Email);
        //         if (!existingObject) {
        //             return acc.concat(current);
        //         }
        //         return acc;
        //     }, []);
        //     global.push(uniqueObjects)
        // }
        for (let k in formateData) {
            const postData = formateData[k];
            let userEmail = { Email: postData.Email }
           let haveMain = global.filter((i) => i.Email == postData.Email )

            if (haveMain.length == 0 || haveMain[0].Email !== postData.Email) {
                fetch('https://main--automailsender.netlify.app/api/mail/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(postData),
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log('Response from backend:', data);
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
                global.push(userEmail)
            }
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});
// export default function handler(req, res) {
//     res.status(200).end();
// }
