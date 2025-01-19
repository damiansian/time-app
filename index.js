// Set default values for date and time inputs
window.addEventListener('load', function() {
    const dateInput = document.getElementById('date-picker');
    const timeInput = document.getElementById('time-picker');

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    dateInput.value = `${year}-${month}-${day}`;
    timeInput.value = `${hours}:${minutes}`;
});

document.getElementById('convert-button').addEventListener('click', function() {
    const date = document.getElementById('date-picker').value;
    const time = document.getElementById('time-picker').value;

    if (date && time) {
        const dateTime = new Date(`${date}T${time}`);
        const timeZoneResults = document.getElementById('time-zone-results');
        
        // Clear previous results
        timeZoneResults.innerHTML = '';

        // Create table
        const table = document.createElement('table');
        table.className = 'table-auto min-w-full bg-white border border-gray-200';
        const thead = document.createElement('thead');
        thead.className = 'bg-gray-200';
        const tbody = document.createElement('tbody');

        // Create table headers
        const headers = ['City', 'Day', 'Time', 'AM/PM'];
        const tr = document.createElement('tr');
        headers.forEach(header => {
            const th = document.createElement('th');
            th.className = 'py-2 px-4 border-b border-gray-200 text-left text-sm font-medium text-gray-700';
            th.textContent = header;
            tr.appendChild(th);
        });
        thead.appendChild(tr);
        table.appendChild(thead);

        // Time zones to convert to
        const timeZones = {
            "San Jose": "America/Los_Angeles",
            "Austin": "America/Chicago",
            "Chicago": "America/Chicago",
            "New York City": "America/New_York",
            "London": "Europe/London",
            "Bucharest": "Europe/Bucharest",
            "Bangalore": "Asia/Kolkata",
            "Tokyo": "Asia/Tokyo"
        };

        // Display the selected date and time in each time zone
        for (const [city, timeZone] of Object.entries(timeZones)) {
            const formatter = new Intl.DateTimeFormat('en-US', {
                timeZone,
                weekday: 'long',
                hour: 'numeric',
                minute: 'numeric',
                hour12: true
            });
            const formattedDate = formatter.formatToParts(dateTime);
            const day = formattedDate.find(part => part.type === 'weekday').value;
            const time = formattedDate.find(part => part.type === 'hour').value + ':' + formattedDate.find(part => part.type === 'minute').value;
            const ampm = formattedDate.find(part => part.type === 'dayPeriod').value;

            const tr = document.createElement('tr');
            tr.className = 'hover:bg-gray-100';
            const cityTd = document.createElement('td');
            cityTd.className = 'py-2 px-4 border-b border-gray-200';
            cityTd.textContent = city;
            const dayTd = document.createElement('td');
            dayTd.className = 'py-2 px-4 border-b border-gray-200';
            dayTd.textContent = day;
            const timeTd = document.createElement('td');
            timeTd.className = 'py-2 px-4 border-b border-gray-200';
            timeTd.textContent = time;
            const ampmTd = document.createElement('td');
            ampmTd.className = 'py-2 px-4 border-b border-gray-200';
            ampmTd.textContent = ampm;

            tr.appendChild(cityTd);
            tr.appendChild(dayTd);
            tr.appendChild(timeTd);
            tr.appendChild(ampmTd);
            tbody.appendChild(tr);
        }

        table.appendChild(tbody);
        timeZoneResults.appendChild(table);
    } else {
        alert('Please select both date and time.');
    }
});