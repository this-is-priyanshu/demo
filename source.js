const college = document.getElementById('college');
const iff_sxc = document.getElementById('iff-sxc');
const iff_sxc_input = document.getElementById('roll');

college.addEventListener('change', function () {

    const abbr = this.value.toLowerCase().split(/ +/).map((a) => a[0]).join('').substring(0, 3)

    if (abbr === 'sxc') {
        iff_sxc.classList.remove('hidden-block');
        iff_sxc.classList.add('show-block');
    } else {
        iff_sxc.classList.remove('show-block');
        iff_sxc.classList.add('hidden-block');
        iff_sxc_input.value = '';
    }
});

const form = document.getElementById('event-registration');

form.addEventListener('submit', function(e) {
    e.preventDefault();

    const dude = document.querySelector('.loader-father')
    dude.classList.remove('noshow')

    const cook= document.querySelector('.form-container')
    cook.classList.add('blurout')

    const fd = new FormData(this);
    const data = Object.fromEntries(fd.entries());

    data.timestamp = new Date();

    const everything = Object.values(data).join('')

    window.crypto.subtle.digest('SHA-1', new TextEncoder().encode(everything))
        .then(
            value => {

                console.log(value, typeof(value))

                data.id = new Uint8Array(value).toBase64()
                const jd = JSON.stringify(data)

                fetch("https://formsubmit.co/ajax/52d746f64b8bdb48c680e21137d1a596", {
                    method: "POST",
                    headers: { 
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: jd
                })
                    .then(response => response.json())
                    .then(doop => {

                        console.log(doop)
                        const thing = JSON.stringify({
                            name: data.name,
                            college: data.college,
                            ticket: data.id,
                            timestamp: data.timestamp
                        })

                        const transport = new TextEncoder().encode(thing).toBase64();

                        console.log(fd, jd, transport, typeof(transport));
                        window.location.href = '/submit.html?v=' + transport;
                    })
                    .catch(error => console.log(error));
            })
})
