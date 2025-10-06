document.addEventListener("DOMContentLoaded", () => {
 AOS.init();

  //  Section Switching
  const menuItems = document.querySelectorAll("#menu li");
  const sections = document.querySelectorAll(".page");

  function showSection(id) {
    sections.forEach(sec => sec.classList.remove("active"));
    document.getElementById(id).classList.add("active");
  }

  menuItems.forEach(item => {
    item.addEventListener("click", () => {
      menuItems.forEach(i => i.classList.remove("active"));
      item.classList.add("active");
      const target = item.getAttribute("data-section");
      showSection(target);
      window.scrollTo({ top: 0, behavior: "smooth" });

      // Animate when section is active
      if (target === "skills") animateSkills();
      if (target === "projects") animateProjects();
      if (target === "certifications") animateCerts();
    });
  });

  //  Typewriter Animation
  const typewriter = document.getElementById("typewriter");
  const text = "Welcome to Your Dynamic Portfolio!";
  let i = 0;
  function type() {
    if (i < text.length) {
      typewriter.textContent += text.charAt(i);
      i++;
      setTimeout(type, 80);
    }
  }
  type();

  // Theme Control
  const themeToggle = document.getElementById("themeToggle");
  const themeSelect = document.getElementById("theme");
  themeToggle.addEventListener("click", () => document.body.classList.toggle("light-mode"));
  themeSelect.addEventListener("change", e => {
    const val = e.target.value;
    if (val === "dark") {
      document.body.style.background = "#1a1a1a";
      document.body.style.color = "white";
    } else if (val === "gradient") {
      document.body.style.background = "linear-gradient(135deg,#667eea,#764ba2)";
      document.body.style.color = "white";
    } else if (val === "sunset") {
      document.body.style.background = "linear-gradient(135deg,#ff7e5f,#feb47b)";
      document.body.style.color = "#222";
    } else {
      document.body.style.background = "white";
      document.body.style.color = "#222";
    }
  });

  // Modal helper functions
  const overlay = document.getElementById("overlay");
  const modal = document.getElementById("modal-content");
  function showModal(contentHTML) {
    modal.innerHTML = contentHTML;
    overlay.classList.remove("hidden");
  }
  function hideModal() {
    overlay.classList.add("hidden");
    modal.innerHTML = "";
  }
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) hideModal();
  });

  // Start Button
  const startBtn = document.getElementById("startBtn");
  startBtn.addEventListener("click", () => {
    showSection("about");
    menuItems.forEach(item => item.classList.remove("active"));
    document.querySelector('#menu li[data-section="about"]').classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => document.getElementById("edit-about-btn").click(), 500);
  });

  // Data storage
  let aboutData = JSON.parse(localStorage.getItem("aboutData")) || { bio: "Your bio here", photo: "", bg: "#fff" };
  let skillsData = JSON.parse(localStorage.getItem("skillsData")) || [];
  let projectsData = JSON.parse(localStorage.getItem("projectsData")) || [];
  let certData = JSON.parse(localStorage.getItem("certData")) || [];
  let contactData = JSON.parse(localStorage.getItem("contactData")) || { email: "example@mail.com" };
  let userLinks = JSON.parse(localStorage.getItem("userLinks")) || [];

  // Render About
  function renderAbout() {
    document.getElementById("about-bio").textContent = aboutData.bio;
    document.getElementById("about-photo").src = aboutData.photo;
    document.getElementById("about").style.background = aboutData.bg;

    const aboutTitle = document.querySelector("#about h2");
    const aboutImg = document.getElementById("about-photo");
    const aboutBio = document.getElementById("about-bio");
    aboutTitle.classList.remove("fade-up");
    aboutImg.classList.remove("slide-left");
    aboutBio.classList.remove("slide-right");
    void aboutTitle.offsetWidth;
    aboutTitle.classList.add("fade-up");
    aboutImg.classList.add("slide-left");
    aboutBio.classList.add("slide-right");
  }
  renderAbout();

  // Edit About
  document.getElementById("edit-about-btn").addEventListener("click", () => {
    showModal(`
      <h3>Edit About Section</h3>
      <label>Bio:</label>
      <textarea id="edit-bio" rows="4">${aboutData.bio}</textarea>
      <label>Background Color:</label>
      <input type="color" id="edit-bg" value="${aboutData.bg}">
      <label>Profile Image:</label>
      <input type="file" id="edit-photo" accept="image/*">
      <div style="margin-top:10px; text-align:right;">
        <button id="save-about">Save</button>
        <button id="close-modal">Cancel</button>
      </div>
    `);

    document.getElementById("edit-photo").addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => (aboutData.photo = ev.target.result);
      reader.readAsDataURL(file);
    });

    document.getElementById("save-about").addEventListener("click", () => {
      aboutData.bio = document.getElementById("edit-bio").value;
      aboutData.bg = document.getElementById("edit-bg").value;
      localStorage.setItem("aboutData", JSON.stringify(aboutData));
      renderAbout();
      hideModal();
      document.getElementById("edit-about-btn").style.display = "none";
    });

    document.getElementById("close-modal").addEventListener("click", hideModal);
  });

  // 🔹 Skills Section
  const mySkills = document.getElementById("mySkills");
const editSkillsContainer = document.getElementById("editSkillsContainer");
const newSkillInput = document.getElementById("newSkillInput");
const addSkillBtn = document.getElementById("addSkillBtn");
const saveSkillsBtn = document.getElementById("saveSkillsBtn");
const clearSkillsBtn = document.getElementById("clearSkillsBtn");
const skillsCircleContainer = document.getElementById("skillsCircleContainer");

// Load skills from localStorage
let skillData = JSON.parse(localStorage.getItem("skillsData")) || [];

// Display saved skills on page load
if (skillData.length > 0) renderSkillsCircle();

// Show input section when clicking "My Skills"
mySkills.addEventListener("click", () => {
  editSkillsContainer.style.display = "flex";
});

// Add a new skill
addSkillBtn.addEventListener("click", () => {
  const skill = newSkillInput.value.trim();
  if (skill) {
    skillData.push(skill);
    newSkillInput.value = "";
    alert(`Skill "${skill}" added!`);
  } else {
    alert("Please enter a skill name.");
  }
});

// Save skills and render them in a circle
saveSkillsBtn.addEventListener("click", () => {
  if (!skillData.length) return alert("Add at least one skill first.");
  editSkillsContainer.style.display = "none";

  //Save to localStorage
  localStorage.setItem("skillsData", JSON.stringify(skillData));

  // Render the skills
  renderSkillsCircle();

  // Start rotation after saving
  skillsCircleContainer.classList.add("active");
});

//  Clear all skills
clearSkillsBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to clear all skills?")) {
    skillData = [];
    localStorage.removeItem("skillsData");
    skillsCircleContainer.innerHTML = '<div class="center-skill">Skills</div>';
    alert("All skills cleared!");
  }
});

// Function to render circular skills layout
function renderSkillsCircle() {
  skillsCircleContainer.innerHTML = '<div class="center-skill">Skills</div>';

  const numSkills = skillData.length;
  const radius = 150;

  skillData.forEach((skill, index) => {
    const angle = (index / numSkills) * 2 * Math.PI;
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);

    const div = document.createElement("div");
    div.textContent = skill;
    div.classList.add("skill");
    div.style.left = `calc(50% + ${x}px - 50px)`;
    div.style.top = `calc(50% + ${y}px - 50px)`;
    skillsCircleContainer.appendChild(div);
  });

  animateSkills();
}

// Animation for showing skills one by one
function animateSkills() {
  const skills = document.querySelectorAll(".skill");
  skills.forEach(skill => skill.classList.remove("show"));
  void skillsCircleContainer.offsetWidth; // force reflow
  skills.forEach((skill, i) =>
    setTimeout(() => skill.classList.add("show"), i * 200)
  );
}



  //  Projects Section
  function renderProjects() {
    const div = document.getElementById("projects-container");
    div.innerHTML = "";
    projectsData.forEach((p, i) => {
      const card = document.createElement("div");
      card.className = "card fade-up";
      card.innerHTML = `
        ${p.image ? `<img src="${p.image}">` : ""}
        <h3>${p.title}</h3>
        <p>${p.desc}</p>
        <button class="editBtn" data-index="${i}">Edit</button>
        <button class="deleteBtn" data-index="${i}">Delete</button>
      `;
      div.appendChild(card);
    });
    animateProjects();
  }

  function animateProjects() {
    const cards = document.querySelectorAll("#projects-container .card");
    cards.forEach((card, i) => {
      card.classList.remove("show");
      void card.offsetWidth;
      setTimeout(() => card.classList.add("show"), i * 200);
    });
  }
  renderProjects();

  // Certifications Section
  function renderCerts() {
    const div = document.getElementById("certifications-container");
    div.innerHTML = "";
    certData.forEach((c, i) => {
      const card = document.createElement("div");
      card.className = "card fade-up";
      card.innerHTML = `
        ${c.image ? `<img src="${c.image}">` : ""}
        <h3>${c.title}</h3>
        <button class="editCertBtn" data-index="${i}">Edit</button>
        <button class="deleteCertBtn" data-index="${i}">Delete</button>
      `;
      div.appendChild(card);
    });
    animateCerts();
  }

  function animateCerts() {
    const cards = document.querySelectorAll("#certifications-container .card");
    cards.forEach((card, i) => {
      card.classList.remove("show");
      void card.offsetWidth;
      setTimeout(() => card.classList.add("show"), i * 200);
    });
  }
  renderCerts();

  // Event delegation for dynamic buttons (Projects)
  document.getElementById("projects-container").addEventListener("click", (e) => {
    const idx = e.target.dataset.index;
    if (e.target.classList.contains("editBtn")) editProject(idx);
    if (e.target.classList.contains("deleteBtn")) { 
      projectsData.splice(idx, 1); 
      localStorage.setItem("projectsData", JSON.stringify(projectsData)); 
      renderProjects(); 
    }
  });

  document.getElementById("certifications-container").addEventListener("click", (e) => {
    const idx = e.target.dataset.index;
    if (e.target.classList.contains("editCertBtn")) editCert(idx);
    if (e.target.classList.contains("deleteCertBtn")) { 
      certData.splice(idx, 1); 
      localStorage.setItem("certData", JSON.stringify(certData)); 
      renderCerts(); 
    }
  });

  // Edit Project
  window.editProject = (i) => {
    const p = projectsData[i];
    showModal(`
      <h3>Edit Project</h3>
      <input id="editProjTitle" value="${p.title}">
      <textarea id="editProjDesc">${p.desc}</textarea>
      <input type="file" id="editProjImage">
      <div style="margin-top:10px;text-align:right;">
        <button id="saveProj">Save</button>
        <button id="close-modal">Cancel</button>
      </div>
    `);
    document.getElementById("editProjImage").addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => (projectsData[i].image = ev.target.result);
      reader.readAsDataURL(file);
    });
    document.getElementById("saveProj").addEventListener("click", () => {
      projectsData[i].title = document.getElementById("editProjTitle").value;
      projectsData[i].desc = document.getElementById("editProjDesc").value;
      localStorage.setItem("projectsData", JSON.stringify(projectsData));
      renderProjects();
      hideModal();
    });
    document.getElementById("close-modal").addEventListener("click", hideModal);
  };

  // Edit Cert
  window.editCert = (i) => {
    const c = certData[i];
    showModal(`
      <h3>Edit Certification</h3>
      <input id="editCertTitle" value="${c.title}">
      <input type="file" id="editCertImage">
      <div style="margin-top:10px;text-align:right;">
        <button id="saveCert">Save</button>
        <button id="close-modal">Cancel</button>
      </div>
    `);
    document.getElementById("editCertImage").addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => (certData[i].image = ev.target.result);
      reader.readAsDataURL(file);
    });
    document.getElementById("saveCert").addEventListener("click", () => {
      certData[i].title = document.getElementById("editCertTitle").value;
      localStorage.setItem("certData", JSON.stringify(certData));
      renderCerts();
      hideModal();
    });
    document.getElementById("close-modal").addEventListener("click", hideModal);
  };

  // Add Project
document.getElementById("add-project-btn").addEventListener("click", () => {
  showModal(`
    <h3>Add New Project</h3>
    <input id="newProjTitle" placeholder="Project Title">
    <textarea id="newProjDesc" placeholder="Project Description"></textarea>
    <input type="file" id="newProjImage">
    <div style="margin-top:10px;text-align:right;">
      <button id="saveNewProj">Save</button>
      <button id="close-modal">Cancel</button>
    </div>
  `);

  document.getElementById("newProjImage").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => (window.newProjImageData = ev.target.result);
    reader.readAsDataURL(file);
  });

  document.getElementById("saveNewProj").addEventListener("click", () => {
    const title = document.getElementById("newProjTitle").value.trim();
    const desc = document.getElementById("newProjDesc").value.trim();
    if (!title || !desc) return alert("Enter title and description");

    projectsData.push({
      title,
      desc,
      image: window.newProjImageData || ""
    });
    localStorage.setItem("projectsData", JSON.stringify(projectsData));
    renderProjects();
    hideModal();
    window.newProjImageData = null;
  });

  document.getElementById("close-modal").addEventListener("click", hideModal);
});

// Add Certification
document.getElementById("add-cert-btn").addEventListener("click", () => {
  showModal(`
    <h3>Add New Certification</h3>
    <input id="newCertTitle" placeholder="Certification Title">
    <input type="file" id="newCertImage">
    <div style="margin-top:10px;text-align:right;">
      <button id="saveNewCert">Save</button>
      <button id="close-modal">Cancel</button>
    </div>
  `);

  document.getElementById("newCertImage").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => (window.newCertImageData = ev.target.result);
    reader.readAsDataURL(file);
  });

  document.getElementById("saveNewCert").addEventListener("click", () => {
    const title = document.getElementById("newCertTitle").value.trim();
    if (!title) return alert("Enter certification title");

    certData.push({
      title,
      image: window.newCertImageData || ""
    });
    localStorage.setItem("certData", JSON.stringify(certData));
    renderCerts();
    hideModal();
    window.newCertImageData = null;
  });

  document.getElementById("close-modal").addEventListener("click", hideModal);
});



// Save All Projects
document.getElementById("save-projects-btn").addEventListener("click", () => {
  localStorage.setItem("projectsData", JSON.stringify(projectsData));
  document.getElementById("add-project-btn").style.display = "none";
  
  // Hide all edit/delete buttons
  document.querySelectorAll("#projects-container .editBtn, #projects-container .deleteBtn").forEach(btn => {
    btn.style.display = "none";
  });

  // Hide save button itself
  document.getElementById("save-projects-btn").style.display = "none";
});

// Save All Certifications
document.getElementById("save-certs-btn").addEventListener("click", () => {
  localStorage.setItem("certData", JSON.stringify(certData));
  document.getElementById("add-cert-btn").style.display = "none";
  
  // Hide all edit/delete buttons
  document.querySelectorAll("#certifications-container .editCertBtn, #certifications-container .deleteCertBtn").forEach(btn => {
    btn.style.display = "none";
  });

  // Hide save button itself
  document.getElementById("save-certs-btn").style.display = "none";
});


  // Contact / Social Links Section
  const socialLinksContainer = document.getElementById("socialLinks");
  const userLinksList = document.getElementById("userLinksList");
  const linkNameInput = document.getElementById("linkNameInput");
  const linkURLInput = document.getElementById("linkURLInput");
  const addLinkBtn = document.getElementById("addLink");
  const saveLinksBtn = document.createElement("button");
  saveLinksBtn.textContent = "Save Links";

 function renderUserLinks() {
  socialLinksContainer.innerHTML = "";
  userLinks.forEach(link => {
    const a = document.createElement("a");
    a.href = link.url;
    a.target = "_blank";
    a.classList.add("social-link");
    a.innerHTML = `<i class="${link.icon}"></i> ${link.name}`;
    socialLinksContainer.appendChild(a);
  });
}


  
  renderUserLinks();

  addLinkBtn.addEventListener("click", () => {
    const name = linkNameInput.value.trim();
    const url = linkURLInput.value.trim();
    if (!name || !url) return alert("Enter both name and URL");

    let iconClass = "fa-solid fa-link";
    const lower = name.toLowerCase();
    if (lower.includes("linkedin")) iconClass = "fa-brands fa-linkedin";
    else if (lower.includes("github")) iconClass = "fa-brands fa-github";
    else if (lower.includes("twitter")) iconClass = "fa-brands fa-twitter";
    else if (lower.includes("instagram")) iconClass = "fa-brands fa-instagram";

    userLinks.push({ name, url, icon: iconClass });

    const div = document.createElement("div");
    div.classList.add("social-link");
    div.innerHTML = `<i class="${iconClass}"></i> ${name}`;
    userLinksList.appendChild(div);

    linkNameInput.value = "";
    linkURLInput.value = "";

    if (!userLinksList.contains(saveLinksBtn)) userLinksList.appendChild(saveLinksBtn);
  });

  saveLinksBtn.addEventListener("click", () => {
    localStorage.setItem("userLinks", JSON.stringify(userLinks));
    renderUserLinks();
    document.querySelector(".user-inputs").style.display = "none";
  });

});

const contactForm = document.getElementById("contactForm");
const popup = document.getElementById("popupMessage");

contactForm.addEventListener("submit", (e) => {
  e.preventDefault(); // prevent actual form submission

  // Show popup
  popup.style.display = "block";

  // Hide popup after 2 seconds
  setTimeout(() => {
    popup.style.display = "none";
  }, 2000);

  // Optionally reset form
  contactForm.reset();
});
