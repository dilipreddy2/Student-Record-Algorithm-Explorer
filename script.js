const students = [];
let selectedAlgorithm = "linear";
const $ = id => document.getElementById(id);

function showMessage(text, type="success") {
  const el = $("message");
  el.textContent = text;
  el.className = `message ${type}`;
}

function renderStudents() {
  const body = $("studentTable");
  if (!students.length) {
    body.innerHTML = '<tr><td colspan="5" class="empty">No records yet. Add a student or load sample data.</td></tr>';
    return;
  }
  body.innerHTML = students.map((s, i) => `
    <tr>
      <td>${escapeHTML(s.name)}</td><td>${s.roll}</td>
      <td>${escapeHTML(s.department)}</td><td>${s.marks}</td>
      <td><button class="delete-btn" data-delete="${i}" type="button">Delete</button></td>
    </tr>`).join("");
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, ch => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
  }[ch]));
}

$("studentForm").addEventListener("submit", event => {
  event.preventDefault();
  const name = $("studentName").value.trim();
  const roll = Number($("rollNumber").value);
  const department = $("department").value.trim();
  const marks = Number($("marks").value);

  if (!name || !department) return showMessage("Enter both the student name and department.", "error");
  if (!Number.isInteger(roll) || roll <= 0) return showMessage("Roll number must be a positive whole number.", "error");
  if (students.some(s => s.roll === roll)) return showMessage("That roll number already exists. Use a unique roll number.", "error");
  if (!Number.isInteger(marks) || marks < 0 || marks > 100) return showMessage("Marks must be a whole number from 0 to 100.", "error");

  students.push({name, roll, department, marks});
  renderStudents();
  event.target.reset();
  showMessage("Student record added successfully.");
});

$("studentTable").addEventListener("click", event => {
  const index = event.target.dataset.delete;
  if (index !== undefined) {
    students.splice(Number(index), 1);
    renderStudents();
    showMessage("Student record deleted.");
  }
});

$("sampleBtn").addEventListener("click", () => {
  students.splice(0, students.length,
    {name:"Asha Kumar", roll:101, department:"Computer Science", marks:88},
    {name:"Rahul Das", roll:108, department:"Mathematics", marks:76},
    {name:"Meera Nair", roll:115, department:"Physics", marks:94},
    {name:"Arjun Rao", roll:123, department:"Computer Science", marks:81},
    {name:"Diya Shah", roll:140, department:"Commerce", marks:90},
    {name:"Kabir Ali", roll:155, department:"Biology", marks:72}
  );
  renderStudents();
  showMessage("Sample records loaded. Try searching for roll number 123.");
});

$("clearBtn").addEventListener("click", () => {
  students.length = 0;
  renderStudents();
  $("result").innerHTML = "<h3>Ready to search</h3><p>Add student records and run an algorithm.</p>";
  showMessage("All student records cleared.");
});

function linearSearch(list, target) {
  let comparisons = 0;
  const steps = [];
  for (let i = 0; i < list.length; i++) {
    comparisons++;
    steps.push(`Compare target ${target} with roll number ${list[i].roll}.`);
    if (list[i].roll === target) return {student:list[i], comparisons, steps};
  }
  return {student:null, comparisons, steps};
}

function binarySearch(list, target) {
  const sorted = [...list].sort((a,b) => a.roll-b.roll);
  let low = 0, high = sorted.length - 1, comparisons = 0;
  const steps = [];
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    comparisons++;
    steps.push(`Check middle record ${sorted[mid].roll}; current range is positions ${low+1} to ${high+1}.`);
    if (sorted[mid].roll === target) return {student:sorted[mid], comparisons, steps};
    if (sorted[mid].roll < target) low = mid + 1;
    else high = mid - 1;
  }
  return {student:null, comparisons, steps};
}

function jumpSearch(list, target) {
  const sorted = [...list].sort((a,b) => a.roll-b.roll);
  const n = sorted.length;
  const jump = Math.max(1, Math.floor(Math.sqrt(n)));
  let start = 0, end = jump, comparisons = 0;
  const steps = [];
  while (start < n) {
    const idx = Math.min(end, n) - 1;
    comparisons++;
    steps.push(`Check block endpoint ${sorted[idx].roll}.`);
    if (sorted[idx].roll >= target) break;
    start = end;
    end += jump;
    if (start >= n) return {student:null, comparisons, steps};
  }
  for (let i = start; i < Math.min(end, n); i++) {
    comparisons++;
    steps.push(`Check record ${sorted[i].roll} in the selected block.`);
    if (sorted[i].roll === target) return {student:sorted[i], comparisons, steps};
    if (sorted[i].roll > target) break;
  }
  return {student:null, comparisons, steps};
}

function interpolationSearch(list, target) {
  const sorted = [...list].sort((a,b) => a.roll-b.roll);
  let low = 0, high = sorted.length - 1, comparisons = 0;
  const steps = [];
  while (low <= high && target >= sorted[low].roll && target <= sorted[high].roll) {
    if (sorted[low].roll === sorted[high].roll) {
      comparisons++;
      steps.push(`The current range contains the same roll number at both ends.`);
      return {student: sorted[low].roll === target ? sorted[low] : null, comparisons, steps};
    }
    const position = low + Math.floor(
      ((target - sorted[low].roll) * (high - low)) /
      (sorted[high].roll - sorted[low].roll)
    );
    comparisons++;
    steps.push(`Estimate position ${position+1} using the roll-number values.`);
    if (sorted[position].roll === target) return {student:sorted[position], comparisons, steps};
    if (sorted[position].roll < target) low = position + 1;
    else high = position - 1;
  }
  return {student:null, comparisons, steps};
}

const algorithmDetails = {
  linear: {
    title:"Linear Search", time:"O(n)", space:"O(1)",
    explanation:"Checks records one by one from the beginning. It works even when the records are not sorted.",
    run:linearSearch
  },
  binary: {
    title:"Binary Search", time:"O(log n)", space:"O(1)",
    explanation:"Sorts a copy by roll number, checks the middle record, and repeatedly halves the remaining search range.",
    run:binarySearch
  },
  jump: {
    title:"Jump Search", time:"O(√n)", space:"O(1)",
    explanation:"Sorts a copy, jumps ahead in blocks of about √n records, then searches one block linearly.",
    run:jumpSearch
  },
  interpolation: {
    title:"Interpolation Search", time:"Average O(log log n), worst O(n)", space:"O(1)",
    explanation:"Sorts a copy and estimates where the target should be based on its numeric value. It works best when roll numbers are fairly evenly distributed.",
    run:interpolationSearch
  }
};

function displayResult(key, outcome, target) {
  const info = algorithmDetails[key];
  const student = outcome.student;
  $("result").innerHTML = `
    <h3>${info.title}</h3>
    <p>${escapeHTML(info.explanation)}</p>
    <div class="result-meta">
      <span class="metric"><strong>Time:</strong> ${info.time}</span>
      <span class="metric"><strong>Extra space:</strong> ${info.space}</span>
      <span class="metric"><strong>Comparisons:</strong> ${outcome.comparisons}</span>
    </div>
    ${student
      ? `<p class="found">Student found!</p><p><strong>${escapeHTML(student.name)}</strong> · Roll ${student.roll} · ${escapeHTML(student.department)} · Marks ${student.marks}</p>`
      : `<p class="not-found">Student not found.</p><p>No record has roll number ${target}.</p>`}
    <h4>How this search proceeded</h4>
    ${outcome.steps.length ? `<ol>${outcome.steps.map(step => `<li>${escapeHTML(step)}</li>`).join("")}</ol>` : "<p>No comparisons were needed because the list is empty.</p>"}
  `;
}

function runSelected() {
  const target = Number($("targetRoll").value);
  if (!students.length) {
    $("result").innerHTML = '<h3>No student records</h3><p>Add records or load sample data before searching.</p>';
    return;
  }
  if (!Number.isInteger(target) || target <= 0) {
    $("result").innerHTML = '<h3>Invalid roll number</h3><p>Enter a positive whole-number roll number.</p>';
    return;
  }
  const result = algorithmDetails[selectedAlgorithm].run(students, target);
  displayResult(selectedAlgorithm, result, target);
}

document.querySelectorAll(".tab").forEach(button => {
  button.addEventListener("click", () => {
    selectedAlgorithm = button.dataset.algorithm;
    document.querySelectorAll(".tab").forEach(tab => {
      const active = tab === button;
      tab.classList.toggle("active", active);
      tab.setAttribute("aria-selected", String(active));
    });
    if ($("targetRoll").value) runSelected();
  });
});
$("searchBtn").addEventListener("click", runSelected);
$("targetRoll").addEventListener("keydown", event => {
  if (event.key === "Enter") runSelected();
});

renderStudents();
