// script.js
document.addEventListener('DOMContentLoaded', () => {
    const datePicker = document.getElementById('date-picker');
    const timePicker = document.getElementById('time-picker');
    const convertButton = document.getElementById('convert-button');
    const timeZoneResults = document.getElementById('time-zone-results');


    convertButton.addEventListener('click', () => {
        const selectedDate = datePicker.value;
        const selectedTime = timePicker.value;
        if(!selectedDate || !selectedTime){
          alert("Please select both date and time")
          return;
        }

        const selectedDateTime = `${selectedDate}T${selectedTime}`;
        const selectedDateObj = new Date(selectedDateTime);


        if (isNaN(selectedDateObj.getTime())) {
          alert("Please Enter a valid Date and time")
            return;
        }
      

        timeZoneResults.innerHTML = ''; // Clear previous results

        const timeZones = [
          "America/Los_Angeles",
          "America/New_York",
          "Europe/London",
          "Europe/Paris",
          "Asia/Tokyo",
          "Asia/Dubai",
          "Australia/Sydney",
          "Pacific/Honolulu",
            "Africa/Johannesburg",
        ];

      
      timeZones.forEach(timeZone =>{
        try{
           const timeInTz = selectedDateObj.toLocaleString('en-US', { timeZone,
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                 timeZoneName: 'short'
            });
            const formattedOutput = `<p>${timeZone}: ${timeInTz}</p>`
            timeZoneResults.innerHTML += formattedOutput;

        } catch(err){
          console.error(`Error converting to timezone ${timeZone}:`,err)
            const formattedOutput = `<p>${timeZone}: Not Available</p>`
            timeZoneResults.innerHTML += formattedOutput;
        }
      })
    });
});