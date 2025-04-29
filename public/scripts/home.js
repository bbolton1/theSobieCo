window.onload = async function() {
    console.log("Hello World from Vanilla JS!");

    await getLatestSobieConferenceData();
}

async function getLatestSobieConferenceData() {
    try {
        const response = await fetch('/home/latestConferenceInfo');
        const data = await response.json();
        console.log('Data loaded:', data);

        document.getElementById('latestSobieConfData').innerHTML = JSON.stringify(data);
    } catch (err) {
        console.error('Failed to load data:', err);
    }
}