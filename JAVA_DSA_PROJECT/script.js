// Student Data Management Logic

document.addEventListener('DOMContentLoaded', () => {
    const studentForm = document.getElementById('student-form');
    const studentList = document.getElementById('student-list');
    const searchUsnInput = document.getElementById('search-usn');
    const searchBtn = document.getElementById('search-btn');
    const clearBtn = document.getElementById('clear-btn');

    let students = JSON.parse(localStorage.getItem('students')) || [];

    // Function to render students
    const renderStudents = (data = students) => {
        studentList.innerHTML = '';
        if (data.length === 0) {
            studentList.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted);">No records found.</td></tr>`;
            return;
        }

        data.forEach((student, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.usn}</td>
                <td>${student.name}</td>
                <td>${student.marks}</td>
                <td>${student.branch}</td>
                <td>
                    <button class="btn-delete" data-index="${index}">Delete</button>
                </td>
            `;
            studentList.appendChild(row);
        });

        // Add delete event listeners
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                deleteStudent(index);
            });
        });
    };

    // Add Student
    studentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const usn = document.getElementById('usn').value;
        const name = document.getElementById('name').value;
        const marks = document.getElementById('marks').value;
        const branch = document.getElementById('branch').value;

        // Check if USN already exists
        if (students.some(s => s.usn === usn)) {
            alert('Student with this USN already exists!');
            return;
        }

        const newStudent = { usn, name, marks, branch };
        students.push(newStudent);
        saveAndRender();
        studentForm.reset();
    });

    // Delete Student
    const deleteStudent = (index) => {
        if (confirm('Are you sure you want to delete this record?')) {
            students.splice(index, 1);
            saveAndRender();
        }
    };

    // Search Student
    searchBtn.addEventListener('click', () => {
        const query = searchUsnInput.value;
        if (!query) {
            renderStudents();
            return;
        }
        const filtered = students.filter(s => s.usn.toString() === query);
        renderStudents(filtered);
    });

    // Clear Search
    clearBtn.addEventListener('click', () => {
        searchUsnInput.value = '';
        renderStudents();
    });

    // Save to LocalStorage and Render
    const saveAndRender = () => {
        localStorage.setItem('students', JSON.stringify(students));
        renderStudents();
    };

    // Initial render
    renderStudents();
});
