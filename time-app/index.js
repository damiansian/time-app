// Set default values for date and time inputs
window.addEventListener('load', function() {
    const dateInput = document.getElementById('date-picker');
    const hourPicker = document.getElementById('hour-picker');
    const minutePicker = document.getElementById('minute-picker');
    const ampmPicker = document.getElementById('ampm-picker');

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    dateInput.value = `${year}-${month}-${day}`;

    populateHourOptions();
    populateMinuteOptions();
    setDefaultTime();

    function populateHourOptions() {
        for (let hour = 1; hour <= 12; hour++) {
            const option = document.createElement('option');
            option.value = hour;
            option.textContent = hour;
            hourPicker.appendChild(option);
        }
    }

    function populateMinuteOptions() {
        const minutes = [0, 15, 30];
        minutes.forEach(minute => {
            const option = document.createElement('option');
            option.value = String(minute).padStart(2, '0');
            option.textContent = String(minute).padStart(2, '0');
            minutePicker.appendChild(option);
        });
    }

    function setDefaultTime() {
        let hours = now.getHours();
        const minutes = Math.floor(now.getMinutes() / 15) * 15;
        const ampm = hours >= 12 ? 'PM' : 'AM';

        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'

        hourPicker.value = hours;
        minutePicker.value = String(minutes).padStart(2, '0');
        ampmPicker.value = ampm;
    }
});

document.getElementById('convert-button').addEventListener('click', function() {
    const date = document.getElementById('date-picker').value;
    const hour = parseInt(document.getElementById('hour-picker').value);
    const minute = document.getElementById('minute-picker').value;
    const ampm = document.getElementById('ampm-picker').value;

    let convertedHour = hour;
    if (ampm === 'PM' && hour !== 12) {
        convertedHour += 12;
    } else if (ampm === 'AM' && hour === 12) {
        convertedHour = 0;
    }

    const time = `${String(convertedHour).padStart(2, '0')}:${minute}`;
    const localDateTime = new Date(`${date}T${time}:00`);

    // Create the table based on the converted time
    const timeZoneResults = document.getElementById('time-zone-results');
    timeZoneResults.innerHTML = `
        <div class="overflow-x-auto">
            <table class="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr class="bg-gray-100 border-b">
                        <th class="py-2 px-4 border-r">Friendly</th>
                        <th class="py-2 px-4 border-r">City</th>
                        <th class="py-2 px-4 border-r">Day</th>
                        <th class="py-2 px-4 border-r">Time</th>
                        <th class="py-2 px-4">AM/PM</th>
                    </tr>
                </thead>
                <tbody>
                    ${generateTimeZoneRows(localDateTime)}
                </tbody>
            </table>
        </div>
    `;
});

function generateTimeZoneRows(localDateTime) {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const timeZones = [
        { name: 'San Jose', timeZone: 'America/Los_Angeles' },
        { name: 'Austin', timeZone: 'America/Chicago' },
        { name: 'Chicago', timeZone: 'America/Chicago' },
        { name: 'NYC', timeZone: 'America/New_York' },
        { name: 'London', timeZone: 'Europe/London' },
        { name: 'Bucharest', timeZone: 'Europe/Bucharest' },
        { name: 'Bangalore', timeZone: 'Asia/Kolkata' },
        { name: 'Tokyo', timeZone: 'Asia/Tokyo' },
    ];

    return timeZones.map(tz => {
        const options = { timeZone: tz.timeZone, weekday: 'long', hour: 'numeric', minute: 'numeric', hour12: true };
        const formatter = new Intl.DateTimeFormat('en-US', options);
        const parts = formatter.formatToParts(localDateTime);
        const day = parts.find(part => part.type === 'weekday').value;
        const hour = parseInt(parts.find(part => part.type === 'hour').value);
        const minute = parts.find(part => part.type === 'minute').value;
        const ampm = parts.find(part => part.type === 'dayPeriod').value.toUpperCase();

        const isFriendly = (day !== 'Saturday' && day !== 'Sunday') && 
                           ((ampm === 'AM' && hour >= 9 && hour < 12) || (ampm === 'PM' && (hour === 12 || hour < 5)));

        const isUserTimeZone = tz.timeZone === userTimeZone;

        return `
            <tr class="border-b ${isFriendly ? 'bg-green-100' : 'bg-red-100'} ${isUserTimeZone ? 'user-timezone' : ''}">
                <td class="py-2 px-4 border-r">
                    <i class="fas ${isFriendly ? 'fa-smile text-green-500' : 'fa-frown text-red-500'}" aria-hidden="true"></i>
                    <span class="sr-only">${isFriendly ? 'Friendly' : 'Not Friendly'}</span>
                </td>
                <td class="py-2 px-4 border-r">${tz.name}</td>
                <td class="py-2 px-4 border-r">${day}</td>
                <td class="py-2 px-4 border-r">${hour}:${minute}</td>
                <td class="py-2 px-4">${ampm}</td>
            </tr>
        `;
    }).join('');
}