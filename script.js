// smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute("href"))
            .scrollIntoView({ behavior: "smooth" });
    });
});

const form = document.getElementById("studentForm");
const recordArea = document.getElementById("recordArea");
const totalRecords = document.getElementById("totalRecords");
const clearBtn = document.getElementById("clearBtn");

// LOAD DATA FROM FIREBASE
function loadStudents() {

    db.collection("students").onSnapshot(snapshot => {

        recordArea.innerHTML = "";
        let count = 0;

        if (snapshot.empty) {
            recordArea.innerHTML = "No student records added yet.";
        }

        snapshot.forEach(doc => {
            const s = doc.data();

            const div = document.createElement("div");
            div.innerHTML = `
                <strong>${s.name}</strong><br>
                ${s.email} | ${s.phone}<br>
                ${s.course} | Marks: ${s.marks}
                <hr>
            `;

            recordArea.appendChild(div);
            count++;
        });

        totalRecords.textContent = count;
    });
}

// SAVE RECORD TO FIREBASE
form.addEventListener("submit", e => {
    e.preventDefault();

    db.collection("students").add({
        name: name.value,
        email: email.value,
        phone: phone.value,
        course: course.value,
        marks: marks.value
    }).then(() => {
        form.reset();
    });
});

// CLEAR DATABASE
clearBtn.addEventListener("click", async () => {
    const snapshot = await db.collection("students").get();
    snapshot.forEach(doc => doc.ref.delete());
});

loadStudents();
