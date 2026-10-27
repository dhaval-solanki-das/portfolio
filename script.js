/* ==========================================================
   DHAVAL SOLANKI - PORTFOLIO INTERACTION ENGINE (script.js)
   Features: Typewriter, Playground Simulator, Filtering, Modals, Audio Waves
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // 1. DYNAMIC TYPEWRITER EFFECT
  const typewriterElement = document.getElementById('typewriter-text');
  const phrases = [
    'Autonomous AI Agents',
    'RAG Retrieval Pipelines',
    'LLaMA 3.1 LoRA Fine-Tuning',
    'Enterprise Voice AI (VAPI)',
    'Computer Vision & OCR Systems'
  ];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 90;

  function typeWriter() {
    const currentPhrase = phrases[phraseIndex];
    if (!typewriterElement) return;

    if (isDeleting) {
      typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 35;
    } else {
      typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 85;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      typingSpeed = 2200; // Pause at completion
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 400;
    }

    setTimeout(typeWriter, typingSpeed);
  }
  if (typewriterElement) typeWriter();


  // 2. CURSOR SPOTLIGHT FOLLOWER
  const cursorGlow = document.getElementById('cursor-glow');
  window.addEventListener('mousemove', (e) => {
    if (cursorGlow) {
      cursorGlow.style.left = `${e.clientX}px`;
      cursorGlow.style.top = `${e.clientY}px`;
    }
  });


  // 3. MOBILE MENU TOGGLE
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIcon = document.getElementById('menu-icon');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const isHidden = mobileMenu.classList.contains('hidden');
      if (isHidden) {
        mobileMenu.classList.remove('hidden');
        menuIcon.classList.replace('fa-bars', 'fa-xmark');
      } else {
        mobileMenu.classList.add('hidden');
        menuIcon.classList.replace('fa-xmark', 'fa-bars');
      }
    });

    document.querySelectorAll('.mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        menuIcon.classList.replace('fa-xmark', 'fa-bars');
      });
    });
  }


  // 4. STICKY NAVBAR ACTIVE SCROLLSPY
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 140;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('text-cyan-400');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('text-cyan-400');
      }
    });
  });


  // 5. INTERACTIVE LIVE AI PLAYGROUND
  const playgroundTabs = document.querySelectorAll('.playground-tab');
  const playgroundViews = {
    rag: document.getElementById('tab-rag'),
    voice: document.getElementById('tab-voice'),
    vision: document.getElementById('tab-vision')
  };

  playgroundTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      playgroundTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const targetMode = tab.getAttribute('data-tab');
      Object.keys(playgroundViews).forEach(key => {
        if (playgroundViews[key]) {
          if (key === targetMode) {
            playgroundViews[key].classList.remove('hidden');
          } else {
            playgroundViews[key].classList.add('hidden');
          }
        }
      });
    });
  });

  // --- RAG Simulator Logic ---
  const ragInput = document.getElementById('rag-query-input');
  const runRagBtn = document.getElementById('run-rag-btn');
  const ragLatency = document.getElementById('rag-latency');
  const ragChunks = document.getElementById('rag-retrieved-chunks');
  const ragOutput = document.getElementById('rag-synthesized-output');
  const ragSampleBtns = document.querySelectorAll('.rag-sample-btn');

  const ragScenarios = {
    "villas": {
      similarity: "0.954",
      chunkId: "AU-GC-8492 (Gold Coast Waterfront Index)",
      chunkText: '"Sanctuary Cove Villa 14: 3 Beds, 3.5 Baths, private pontoon dock, 24/7 security. Listed at AUD $1,980,000. HOA fees $420/quarter."',
      response: "Found prime match: **Sanctuary Cove Villa 14 (Gold Coast)** at **AUD $1,980,000** (well under your $2.2M budget). Features 3 bedrooms, 3.5 bathrooms, and a private deep-water marina berth suitable for vessels up to 45ft. Would you like me to schedule a virtual tour or request the strata inspection report?"
    },
    "yield": {
      similarity: "0.928",
      chunkId: "IN-PROP-ANALYTICS-2025",
      chunkText: '"Surat Vesu & Pal corridors: Gross yield 4.8% - 5.4%, driven by textile/diamond executive influx. Ahmedabad SG Highway: Gross yield 4.2% - 4.7%, high capital appreciation."',
      response: "Grounded Market Yield Analysis: **Surat (Vesu/Pal)** currently offers higher rental yields (**4.8% – 5.4%**) with strong occupancy from business executives. **Ahmedabad (SG Highway/GIFT City corridor)** delivers **4.2% – 4.7%** rental yield, but with higher historical capital appreciation (**~11% YoY**)."
    },
    "zoning": {
      similarity: "0.962",
      chunkId: "COUNCIL-BYLAWS-SEC4B",
      chunkText: '"Ancillary Dwelling Units (ADU): Max floor area 60 sqm. Setback requirements: 1.5m side/rear. Must not exceed 50% of the private open space. Complying Development Certificate (CDC) approved within 20 days."',
      response: "According to municipal planning regulations: Secondary dwellings/ADUs up to **60 sqm** qualify for accelerated approval via CDC within **20 days**. Mandatory minimum 1.5m rear/side setbacks apply, and the secondary unit cannot occupy more than 50% of total private yard area."
    }
  };

  ragSampleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (ragInput) ragInput.value = btn.getAttribute('data-query');
      executeRagDemo();
    });
  });

  if (runRagBtn) {
    runRagBtn.addEventListener('click', executeRagDemo);
  }

  function executeRagDemo() {
    const query = (ragInput ? ragInput.value.toLowerCase() : '');
    runRagBtn.disabled = true;
    runRagBtn.innerHTML = `<span>Retrieving...</span> <i class="fa-solid fa-spinner fa-spin"></i>`;
    ragOutput.innerHTML = `<span class="text-slate-400 font-mono text-xs">Traversing vector space & embeddings... Synthesizing response with fine-tuned LLaMA 3.1...</span>`;

    const randomLatency = Math.floor(Math.random() * 50) + 120; // 120ms - 170ms

    setTimeout(() => {
      let scenario = ragScenarios["villas"];
      if (query.includes("yield") || query.includes("surat") || query.includes("ahmedabad")) {
        scenario = ragScenarios["yield"];
      } else if (query.includes("zoning") || query.includes("adu") || query.includes("permit")) {
        scenario = ragScenarios["zoning"];
      }

      ragLatency.textContent = `${randomLatency} ms`;
      document.getElementById('rag-status-badge').textContent = `Vector Similarity: ${scenario.similarity}`;

      ragChunks.innerHTML = `
        <div class="text-slate-300 font-semibold text-[11px]">[Grounding Chunk - ${scenario.chunkId}]</div>
        <div>${scenario.chunkText}</div>
      `;

      ragOutput.innerHTML = `
        <strong class="text-cyan-300 font-mono text-xs block mb-1">🤖 Synthesized Response (LLaMA 3.1 LoRA):</strong>
        <p>${scenario.response}</p>
      `;

      runRagBtn.disabled = false;
      runRagBtn.innerHTML = `<span>Execute RAG</span> <i class="fa-solid fa-bolt"></i>`;
    }, 600);
  }

  // --- Voice AI Simulator Logic (VAPI + Twilio) ---
  const startCallBtn = document.getElementById('start-call-btn');
  const endCallBtn = document.getElementById('end-call-btn');
  const callStatePill = document.getElementById('call-state-pill');
  const waveformContainer = document.getElementById('waveform-container');
  const voiceTranscript = document.getElementById('voice-transcript');

  if (startCallBtn) {
    startCallBtn.addEventListener('click', () => {
      startCallBtn.classList.add('hidden');
      endCallBtn.classList.remove('hidden');
      callStatePill.textContent = 'Connecting SIP...';
      callStatePill.className = 'text-yellow-400 bg-yellow-950/60 px-2.5 py-0.5 rounded-full border border-yellow-500/30';

      setTimeout(() => {
        callStatePill.textContent = 'In Call (Twilio • 18ms)';
        callStatePill.className = 'text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/30 animate-pulse';
        waveformContainer.classList.add('animating-waveform');

        voiceTranscript.innerHTML = `
          <div class="flex gap-3">
            <span class="font-mono text-xs text-purple-400 flex-shrink-0">Caller:</span>
            <p class="text-slate-300">"Hi, I noticed the commercial warehouse listing in Surat. Does it have 3-phase industrial power?"</p>
          </div>
          <div class="flex gap-3 bg-white/[0.02] p-2.5 rounded-lg border border-white/5">
            <span class="font-mono text-xs text-cyan-400 flex-shrink-0">AI Agent:</span>
            <p class="text-slate-100">"Hello! Yes, that 12,000 sq ft facility features a dedicated 150 kVA three-phase transformer, dual container-height loading docks, and 24/7 security access. Would you like me to send the specification sheet to your mobile?"</p>
          </div>
        `;
      }, 800);
    });
  }

  if (endCallBtn) {
    endCallBtn.addEventListener('click', () => {
      endCallBtn.classList.add('hidden');
      startCallBtn.classList.remove('hidden');
      callStatePill.textContent = 'Call Ended';
      callStatePill.className = 'text-slate-400 bg-slate-800 px-2.5 py-0.5 rounded-full';
      waveformContainer.classList.remove('animating-waveform');
    });
  }

  // --- Vision & OCR Simulator Logic ---
  const visionBtns = document.querySelectorAll('.vision-mode-btn');
  const visionSampleBox = document.getElementById('vision-sample-box');
  const extractVisionBtn = document.getElementById('extract-vision-btn');
  const ocrJsonOutput = document.getElementById('ocr-json-output');

  let activeVisionMode = 'po';

  visionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      visionBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeVisionMode = btn.getAttribute('data-vision');

      if (activeVisionMode === 'po') {
        visionSampleBox.innerHTML = `
          <i class="fa-solid fa-file-invoice-dollar text-3xl text-cyan-400 mb-2"></i>
          <div class="text-xs font-mono text-slate-300">Apex Corp - Purchase Order #PO-50392</div>
          <div class="text-[11px] text-slate-500 mt-1">Vendor: Apex Industrial Supplies | SKU-9941</div>
        `;
        ocrJsonOutput.textContent = `{\n  "purchase_order": "PO-50392",\n  "vendor": "Apex Industrial Supplies Ltd",\n  "vendor_email": "orders@apexindustrial.com",\n  "total_items": 140,\n  "line_items": [\n    { "sku": "APX-8820", "qty": 100, "unit_price": 45.00 },\n    { "sku": "APX-3011", "qty": 40, "unit_price": 12.50 }\n  ],\n  "total_amount_usd": 5000.00,\n  "erp_sync_status": "AUTO_APPROVED"\n}`;
      } else {
        visionSampleBox.innerHTML = `
          <i class="fa-solid fa-car text-3xl text-emerald-400 mb-2"></i>
          <div class="text-xs font-mono text-slate-300">Traffic Camera Stream #CAM-4</div>
          <div class="text-[11px] text-slate-500 mt-1">Vehicle: Tesla Model 3 | Detected Bounding Box [0.42, 0.65]</div>
        `;
        ocrJsonOutput.textContent = `{\n  "frame_id": 98421,\n  "camera_source": "CAM-4_WEST_GATE",\n  "detected_object": "vehicle_number_plate",\n  "yolo_confidence": 0.984,\n  "plate_number": "GJ-01-EQ-4491",\n  "recognition_engine": "TrOCR_Transformer",\n  "access_status": "AUTHORIZED_PARKING_ZONE"\n}`;
      }
    });
  });

  if (extractVisionBtn) {
    extractVisionBtn.addEventListener('click', () => {
      extractVisionBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Processing OCR...`;
      extractVisionBtn.disabled = true;

      setTimeout(() => {
        extractVisionBtn.innerHTML = `<i class="fa-solid fa-check text-emerald-400"></i> Extraction Complete!`;
        setTimeout(() => {
          extractVisionBtn.innerHTML = `<i class="fa-solid fa-expand"></i> Run OCR Extraction`;
          extractVisionBtn.disabled = false;
        }, 1200);
      }, 600);
    });
  }


  // 6. PROJECT CATEGORY FILTER
  const filterBtns = document.querySelectorAll('.project-filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = card.getAttribute('data-category') || '';
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = 'flex';
          setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => { card.style.display = 'none'; }, 200);
        }
      });
    });
  });


  // 7. PROJECT DEEP DIVE MODAL
  const modal = document.getElementById('project-modal');
  const modalContent = document.getElementById('modal-content');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const modalTriggers = document.querySelectorAll('.open-project-modal');

  const projectDetails = {
    crm: {
      title: "AI-Powered Role-Based CRM & Intelligent Purchase Order Automation",
      subtitle: "Enterprise Workflow Automation • Cross-Border Retail & GCP Integration",
      metrics: ["Role-Based Access", "Claude & Gemini Agents", "Sellercloud Sync", "Computer Vision OCR"],
      body: `
        <p class="text-sm text-slate-300 leading-relaxed">
          Developed an end-to-end, enterprise role-based CRM system to manage Purchase Orders, Vendors, Warehouses, Containers, Inventory, and Logistics operations.
        </p>
        <div class="rounded-xl bg-black/40 border border-white/10 p-4 font-mono text-xs text-cyan-300 space-y-2">
          <div class="text-white font-bold">Key Architectural Highlights:</div>
          <div>• <strong>Natural Language to SQL Data Agent:</strong> Built an AI-powered Data Agent using Gemini and Claude to answer natural language questions, retrieve real-time warehouse data, and convert user queries into SQL.</div>
          <div>• <strong>AI Purchase Order Agent:</strong> Automatically generates POs and syncs order data with Sellercloud and Google Cloud databases.</div>
          <div>• <strong>Computer Vision & OCR:</strong> Implemented OCR-based PO generation workflow to extract SKU details, vendor info, quantities, and prices from handwritten notes or uploaded documents.</div>
        </div>
      `,
      github: "https://github.com/dhaval-solanki-das/task_ai_knowledge_platform"
    },
    rag: {
      title: "Real Estate Conversational Chatbot using RAG & LLaMA 3.1 LoRA",
      subtitle: "Domain-Specific LLM Fine-Tuning • Enterprise Production System",
      metrics: ["LLaMA 3.1 Fine-Tuned", "LoRA PEFT", "Claude Synthetic Datasets", "Vector Semantic Search"],
      body: `
        <p class="text-sm text-slate-300 leading-relaxed">
          Engineered a production conversational chatbot for real estate client interactions with high context retention and strict factual accuracy.
        </p>
        <div class="rounded-xl bg-black/40 border border-white/10 p-4 font-mono text-xs text-purple-300 space-y-2">
          <div class="text-white font-bold">Key Architectural Highlights:</div>
          <div>• <strong>Knowledge Retrieval Pipeline:</strong> Integrated dense semantic vector search to ground responses directly in domain-specific real estate listings.</div>
          <div>• <strong>LoRA Parameter-Efficient Fine-Tuning:</strong> Fine-tuned open-source LLaMA 3.1 model using Low-Rank Adaptation (LoRA), optimizing compute memory while maximizing task-specific accuracy.</div>
          <div>• <strong>Synthetic Data Generation:</strong> Formulated specialized Claude prompt strategies to generate thousands of multi-persona training samples.</div>
        </div>
      `,
      github: "https://github.com/dhaval-solanki-das/medical-chatbot"
    },
    voice: {
      title: "Autonomous Voice-Enabled AI Telephony Agent",
      subtitle: "Real-Time Conversational AI • VAPI & Twilio Integration",
      metrics: ["Twilio SIP Trunking", "VAPI Voice Engine", "Sub-Second Latency", "Dynamic Dialogue"],
      body: `
        <p class="text-sm text-slate-300 leading-relaxed">
          Developed a live voice-based AI agent using VAPI and Twilio, enabling automated two-way customer phone interactions for property inquiries and support.
        </p>
        <div class="rounded-xl bg-black/40 border border-white/10 p-4 font-mono text-xs text-cyan-300 space-y-2">
          <div class="text-white font-bold">Key Architectural Highlights:</div>
          <div>• Configured Twilio phone number provisioning, webhooks, and SIP telephony infrastructure.</div>
          <div>• Integrated streaming speech-to-text and low-latency text-to-speech pipelines.</div>
          <div>• Handles interruptions, multi-turn state machines, and automated calendar slot reservation.</div>
        </div>
      `,
      github: "https://github.com/dhaval-solanki-das/portfolio"
    },
    vision: {
      title: "AI-Powered Vehicle Number Plate Detection & Recognition (ANPR)",
      subtitle: "Deep Learning Vision Pipeline • YOLO + OpenCV + TrOCR",
      metrics: ["YOLO Object Detection", "OpenCV Preprocessing", "EasyOCR & TrOCR", "Real-Time Stream Processing"],
      body: `
        <p class="text-sm text-slate-300 leading-relaxed">
          Engineered an end-to-end computer vision system to automatically detect and read automobile registration plates for automated parking gates and smart traffic monitoring.
        </p>
        <div class="rounded-xl bg-black/40 border border-white/10 p-4 font-mono text-xs text-emerald-300 space-y-2">
          <div class="text-white font-bold">Key Architectural Highlights:</div>
          <div>• YOLO object detection extracts the license plate coordinates from live video frames.</div>
          <div>• OpenCV applies adaptive thresholding, bilateral filtering, and deskew transformations.</div>
          <div>• TrOCR transformer model reads alphanumeric characters under extreme angles and low illumination.</div>
        </div>
      `,
      github: "https://github.com/dhaval-solanki-das/car_detection_OpenCV"
    }
  };

  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const pKey = trigger.getAttribute('data-project');
      const data = projectDetails[pKey];
      if (!data) return;

      modalContent.innerHTML = `
        <div class="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">${data.subtitle}</div>
        <h3 class="text-2xl font-bold font-outfit text-white">${data.title}</h3>
        <div class="flex flex-wrap gap-2 my-2">
          ${data.metrics.map(m => `<span class="skill-pill-sm">${m}</span>`).join('')}
        </div>
        ${data.body}
        <div class="pt-4 border-t border-white/10 flex items-center justify-between">
          <a href="${data.github}" target="_blank" rel="noopener noreferrer" class="btn-primary py-2.5 px-5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2">
            <i class="fa-brands fa-github"></i>
            <span>View Source on GitHub</span>
          </a>
          <button id="modal-done-btn" class="btn-secondary py-2.5 px-5 rounded-xl text-xs font-bold uppercase">
            Close
          </button>
        </div>
      `;

      modal.classList.remove('hidden');
      document.getElementById('modal-done-btn').addEventListener('click', () => {
        modal.classList.add('hidden');
      });
    });
  });

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
      modal.classList.add('hidden');
    });
  }

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.add('hidden');
    }
  });


  // 8. CLIPBOARD COPY & TOAST NOTIFICATION
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');

  function showToast(msg) {
    if (!toast) return;
    toastMessage.textContent = msg;
    toast.classList.remove('translate-y-20', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');

    setTimeout(() => {
      toast.classList.remove('translate-y-0', 'opacity-100');
      toast.classList.add('translate-y-20', 'opacity-0');
    }, 2800);
  }

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      navigator.clipboard.writeText('dhaval100lanki@gmail.com').then(() => {
        showToast('Email copied to clipboard!');
      }).catch(() => {
        showToast('dhaval100lanki@gmail.com');
      });
    });
  }


  // 9. CONTACT FORM INTERACTION (Web3Forms API + WhatsApp Auto-Notification)
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');
  const submitBtn = document.getElementById('contact-submit-btn');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !message) return;

      const originalBtnHTML = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>Sending Message...</span> <i class="fa-solid fa-spinner fa-spin"></i>`;
      }

      try {
        const formData = new FormData(contactForm);
        formData.append('subject', `Portfolio Inquiry from ${name}`);
        formData.append('from_name', name);

        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        });

        const data = await response.json();

        if (response.status === 200 && data.success) {
          if (formFeedback) {
            formFeedback.className = 'mt-3 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs text-center font-mono';
            formFeedback.innerHTML = `✨ Message delivered directly to Dhaval's email! Opening WhatsApp...`;
            formFeedback.classList.remove('hidden');
          }
          showToast('Message sent! Forwarding to WhatsApp...');

          // Open WhatsApp with pre-filled inquiry details
          const waText = encodeURIComponent(`Hi Dhaval,\n\nI just sent an inquiry through your portfolio:\n\n👤 *Name:* ${name}\n✉️ *Email:* ${email}\n💬 *Project Details:*\n${message}`);
          const waUrl = `https://wa.me/919106862224?text=${waText}`;

          setTimeout(() => {
            window.open(waUrl, '_blank');
          }, 1000);

          contactForm.reset();
        } else {
          throw new Error(data.message || 'Submission failed');
        }
      } catch (err) {
        console.error('Submission error:', err);
        if (formFeedback) {
          formFeedback.className = 'mt-3 p-3 rounded-xl bg-amber-950/60 border border-amber-500/30 text-amber-300 text-xs text-center font-mono';
          formFeedback.innerHTML = `Email delivery notice: Opening direct WhatsApp connection...`;
          formFeedback.classList.remove('hidden');
        }
        showToast('Connecting via WhatsApp...');
        const waText = encodeURIComponent(`Hi Dhaval,\n\nI tried reaching you via your portfolio:\n\n👤 *Name:* ${name}\n✉️ *Email:* ${email}\n💬 *Project Details:*\n${message}`);
        const waUrl = `https://wa.me/919106862224?text=${waText}`;
        window.open(waUrl, '_blank');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHTML;
        }
      }
    });
  }

});
