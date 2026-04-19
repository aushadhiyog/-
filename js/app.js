// ==========================================
// CONFIGURATION — YE VALUES APNI DALNI HAIN
// ==========================================
// Telegram Bot Token kaise milega:
//   1. Telegram me @BotFather se baat karo
//   2. /newbot command do ya apna existing bot open karo
//   3. Bot ka token copy karo — format: 123456789:AAxxxxxxxxxxxxxxxxxxxxx
//
// Chat ID kaise milega:
//   1. Bot ko us group/channel me add karo jahan PDF chahiye
//   2. Group ke liye: @getidsbot se group ID lo — format: -100xxxxxxxxxx
//   3. Ya browser me: https://api.telegram.org/bot<TOKEN>/getUpdates
//      — koi bhi message bhejo group me, response me "chat":{"id":...} milega

const CONFIG = {
    telegramBotToken: 'APNA_BOT_TOKEN_YAHAN_DALO',   // e.g. 7123456789:AABBccDDeeFFggHH...
    telegramChatId:   'APNA_CHAT_ID_YAHAN_DALO'       // e.g. -1001234567890
};

// ==========================================
// GLOBAL STATE
// ==========================================
let currentStep = 1;
const totalSteps = 4;
let photoDataUrl = null;
let currentLang = 'hi';

// ==========================================
// TERMS & CONDITIONS CONTENT
// ==========================================
const TNC_CONTENT = {
    hi: {
        title: 'नियम एवं शर्तें',
        sub: 'Aushadhiyog किसान पंजीकरण पोर्टल',
        checkLabel: 'मैंने उपरोक्त नियम एवं शर्तें पढ़ ली हैं और मैं इनसे सहमत हूँ। *',
        proceedText: 'सहमत हूँ और आगे बढ़ें →',
        body: `
            <p style="background:#f5f0e8;padding:.75rem;border-radius:.5rem;border-left:4px solid #1b3a1a;font-weight:600;color:#1b3a1a;">
                Aushadhiyog Platform Pvt. Ltd. के किसान पंजीकरण पोर्टल पर आपका स्वागत है। आगे बढ़ने से पहले कृपया निम्नलिखित नियम एवं शर्तें ध्यानपूर्वक पढ़ें।
            </p>

            <h3>1. पंजीकरण एवं पात्रता</h3>
            <ul>
                <li>यह पोर्टल केवल भारतीय किसानों के लिए है जो औषधीय एवं सुगंधित फसलों की खेती में रुचि रखते हैं।</li>
                <li>पंजीकरण के लिए किसान की आयु कम से कम 18 वर्ष होनी चाहिए।</li>
                <li>एक मोबाइल नंबर से केवल एक पंजीकरण मान्य होगा।</li>
                <li>Aushadhiyog अनुचित पाई गई प्रविष्टियों को अस्वीकार करने का अधिकार रखती है।</li>
            </ul>

            <h3>2. किसान के दायित्व</h3>
            <ul>
                <li>किसान कंपनी के निर्देशानुसार खेती करेंगे और गुणवत्ता मानकों का पालन करेंगे।</li>
                <li>उत्पाद को प्राथमिकता से Aushadhiyog को बेचने का प्रयास किया जाएगा।</li>
                <li>फसल की जानकारी और खेती में होने वाले बदलाव समय पर कंपनी को सूचित किए जाएंगे।</li>
                <li>दी गई सभी जानकारी सत्य, सटीक और अद्यतन होनी चाहिए। गलत जानकारी देने पर पंजीकरण निरस्त किया जा सकता है।</li>
            </ul>

            <h3>3. कंपनी के दायित्व</h3>
            <ul>
                <li>Aushadhiyog किसानों को तकनीकी सहायता, बीज/सामग्री और बाजार उपलब्ध कराने का प्रयास करेगी।</li>
                <li>कंपनी उचित मूल्य पर उत्पाद खरीदने का प्रयास करेगी।</li>
                <li>प्राकृतिक आपदा, बाजार उतार-चढ़ाव या अन्य बाहरी कारणों से होने वाले नुकसान के लिए कंपनी जिम्मेदार नहीं होगी।</li>
            </ul>

            <h3>4. डेटा गोपनीयता</h3>
            <ul>
                <li>पंजीकरण में दी गई जानकारी केवल कृषि सहयोग एवं भुगतान प्रक्रिया के लिए उपयोग की जाएगी।</li>
                <li>किसान की व्यक्तिगत जानकारी तृतीय पक्ष को बिना अनुमति साझा नहीं की जाएगी, सिवाय सरकारी आवश्यकता के।</li>
                <li>हम आपकी जानकारी सुरक्षित रखने के लिए उचित तकनीकी उपाय अपनाते हैं।</li>
            </ul>

            <h3>5. अनुबंध की अवधि एवं समाप्ति</h3>
            <ul>
                <li>पंजीकरण की अवधि एक फसल चक्र (सीजन) की होगी, जिसे आपसी सहमति से बढ़ाया जा सकता है।</li>
                <li>किसान या कंपनी दोनों में से कोई भी 30 दिन की पूर्व सूचना देकर अनुबंध समाप्त कर सकता है।</li>
                <li>अनुबंध उल्लंघन की स्थिति में कंपनी तत्काल पंजीकरण रद्द कर सकती है।</li>
            </ul>

            <h3>6. विवाद समाधान</h3>
            <ul>
                <li>किसी भी विवाद की स्थिति में पहले आपसी बातचीत से समाधान का प्रयास किया जाएगा।</li>
                <li>अनसुलझे विवादों का निपटारा गुमला, झारखंड के स्थानीय न्यायालय में होगा।</li>
                <li>इन शर्तों की व्याख्या झारखंड राज्य के कानूनों के अनुसार होगी।</li>
            </ul>

            <h3>7. बदलाव का अधिकार</h3>
            <p>Aushadhiyog इन नियम एवं शर्तों में बिना पूर्व सूचना के बदलाव कर सकती है। नवीनतम शर्तें वेबसाइट पर उपलब्ध रहेंगी।</p>

            <p style="margin-top:1rem;padding:.65rem;background:#e8f5e9;border-radius:.4rem;font-size:.82rem;color:#1b3a1a;font-weight:600;">
                संपर्क: aushadhiyog@gmail.com | 7250915077 | NH-23, Palkoat Road, Gumla, Jharkhand
            </p>
        `
    },
    en: {
        title: 'Terms & Conditions',
        sub: 'Aushadhiyog Farmer Registration Portal',
        checkLabel: 'I have read and agree to the above Terms & Conditions. *',
        proceedText: 'I Agree & Proceed →',
        body: `
            <p style="background:#f5f0e8;padding:.75rem;border-radius:.5rem;border-left:4px solid #1b3a1a;font-weight:600;color:#1b3a1a;">
                Welcome to Aushadhiyog Platform Pvt. Ltd. Farmer Registration Portal. Please read the following Terms & Conditions carefully before proceeding.
            </p>

            <h3>1. Registration & Eligibility</h3>
            <ul>
                <li>This portal is exclusively for Indian farmers interested in cultivating medicinal and aromatic crops.</li>
                <li>Applicant must be at least 18 years of age to register.</li>
                <li>Only one registration per mobile number will be accepted.</li>
                <li>Aushadhiyog reserves the right to reject entries found to be inaccurate or fraudulent.</li>
            </ul>

            <h3>2. Farmer Responsibilities</h3>
            <ul>
                <li>Farmers shall cultivate crops as per company guidelines and maintain quality standards.</li>
                <li>Priority shall be given to selling produce to Aushadhiyog.</li>
                <li>Any changes in crop plan or farming details must be communicated to the company in a timely manner.</li>
                <li>All information provided must be true, accurate and up-to-date. Providing false information may result in cancellation of registration.</li>
            </ul>

            <h3>3. Company Responsibilities</h3>
            <ul>
                <li>Aushadhiyog will endeavor to provide technical support, seeds/materials, and market linkages to registered farmers.</li>
                <li>The company will make efforts to purchase produce at fair prices.</li>
                <li>The company shall not be liable for losses due to natural calamities, market fluctuations, or other external factors.</li>
            </ul>

            <h3>4. Data Privacy</h3>
            <ul>
                <li>Information provided during registration will be used solely for agricultural support and payment processing purposes.</li>
                <li>Personal information will not be shared with third parties without consent, except when required by law.</li>
                <li>We adopt appropriate technical measures to keep your information secure.</li>
            </ul>

            <h3>5. Duration & Termination</h3>
            <ul>
                <li>Registration is valid for one crop cycle (season) and may be extended by mutual consent.</li>
                <li>Either party may terminate the agreement with 30 days prior notice.</li>
                <li>In case of agreement violation, the company may cancel registration immediately.</li>
            </ul>

            <h3>6. Dispute Resolution</h3>
            <ul>
                <li>In case of any dispute, resolution will first be attempted through mutual discussion.</li>
                <li>Unresolved disputes shall be settled in local courts at Gumla, Jharkhand.</li>
                <li>These terms shall be governed by the laws of Jharkhand state.</li>
            </ul>

            <h3>7. Right to Modify</h3>
            <p>Aushadhiyog may update these Terms & Conditions without prior notice. The latest version will always be available on our website.</p>

            <p style="margin-top:1rem;padding:.65rem;background:#e8f5e9;border-radius:.4rem;font-size:.82rem;color:#1b3a1a;font-weight:600;">
                Contact: aushadhiyog@gmail.com | 7250915077 | NH-23, Palkoat Road, Gumla, Jharkhand
            </p>
        `
    }
};

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', function () {
    initializeForm();
    initializeCropManagement();
    initializePhotoUpload();
    initializeDOBAutoAge();
    initializePrevExpToggle();
    populateStates();

    // TnC checkbox — enable/disable proceed button
    const tncCb = document.getElementById('tncCheckbox');
    if (tncCb) {
        tncCb.addEventListener('change', function () {
            const btn = document.getElementById('tncProceedBtn');
            if (this.checked) {
                btn.disabled = false;
                btn.style.background = 'var(--brand)';
                btn.style.cursor = 'pointer';
            } else {
                btn.disabled = true;
                btn.style.background = '#9ca3af';
                btn.style.cursor = 'not-allowed';
            }
        });
    }
});

// ==========================================
// TERMS & CONDITIONS MODAL
// ==========================================
function showTncModal() {
    const modal = document.getElementById('tncModal');
    const body = document.getElementById('tncBody');
    const title = document.getElementById('tncTitle');
    const sub = document.getElementById('tncSub');
    const checkLabel = document.getElementById('tncCheckLabel');
    const proceedBtn = document.getElementById('tncProceedBtn');
    const proceedText = document.getElementById('tncProceedText');

    const c = TNC_CONTENT[currentLang] || TNC_CONTENT['hi'];
    title.textContent = c.title;
    sub.textContent = c.sub;
    body.innerHTML = c.body;
    checkLabel.textContent = c.checkLabel;
    proceedText.textContent = c.proceedText;

    // Reset checkbox state
    const cb = document.getElementById('tncCheckbox');
    cb.checked = false;
    proceedBtn.disabled = true;
    proceedBtn.style.background = '#9ca3af';
    proceedBtn.style.cursor = 'not-allowed';

    modal.classList.add('show');
}

function proceedFromTnc() {
    const cb = document.getElementById('tncCheckbox');
    if (!cb.checked) return;
    document.getElementById('tncModal').classList.remove('show');
    // Also check the form's declaration checkbox
    const formCheck = document.getElementById('declarationCheck');
    if (formCheck) formCheck.checked = true;
}

// ==========================================
// LANGUAGE SYSTEM
// ==========================================
function setLanguage(lang) {
    currentLang = lang;

    // Hide language modal, show T&C modal
    document.getElementById('langModal').style.display = 'none';
    document.getElementById('langToggleBtn').textContent = lang === 'hi' ? 'EN' : 'हि';
    applyLanguage(lang);

    // After language set, show T&C
    showTncModal();
}

function toggleLanguage() {
    const newLang = currentLang === 'hi' ? 'en' : 'hi';
    currentLang = newLang;
    document.getElementById('langToggleBtn').textContent = newLang === 'hi' ? 'EN' : 'हि';
    applyLanguage(newLang);
}

function applyLanguage(lang) {
    document.querySelectorAll('[data-hi]').forEach(el => {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            el.placeholder = lang === 'hi' ? (el.dataset.phi || '') : (el.dataset.pen || '');
        } else {
            el.textContent = lang === 'hi' ? el.dataset.hi : el.dataset.en;
        }
    });
    document.querySelectorAll('option[data-hi]').forEach(opt => {
        opt.textContent = lang === 'hi' ? opt.dataset.hi : opt.dataset.en;
    });
}

// ==========================================
// PHOTO UPLOAD
// ==========================================
function initializePhotoUpload() {
    const input = document.getElementById('photoInput');
    if (!input) return;

    input.addEventListener('change', function () {
        const file = this.files[0];
        if (!file) return;
        if (file.size > 500 * 1024) {
            showNotification('फोटो का आकार 500KB से अधिक नहीं होना चाहिए', 'error');
            this.value = '';
            return;
        }
        const reader = new FileReader();
        reader.onload = function (e) {
            photoDataUrl = e.target.result;
            document.getElementById('photoPreview').src = photoDataUrl;
            document.getElementById('photoPreviewBox').style.display = 'block';
            document.getElementById('photoUploadArea').style.display = 'none';
        };
        reader.readAsDataURL(file);
    });
}

function clearPhoto() {
    photoDataUrl = null;
    document.getElementById('photoInput').value = '';
    document.getElementById('photoPreviewBox').style.display = 'none';
    document.getElementById('photoUploadArea').style.display = 'block';
}

// ==========================================
// DOB → AUTO AGE
// ==========================================
function initializeDOBAutoAge() {
    const dobInput = document.querySelector('input[name="dob"]');
    const ageInput = document.querySelector('input[name="age"]');
    if (dobInput && ageInput) {
        dobInput.addEventListener('change', function () {
            const dob = new Date(this.value);
            const today = new Date();
            let age = today.getFullYear() - dob.getFullYear();
            const m = today.getMonth() - dob.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
            ageInput.value = age > 0 ? age : '';
        });
    }
}

// ==========================================
// PREV EXP TOGGLE
// ==========================================
function initializePrevExpToggle() {
    const sel = document.querySelector('select[name="previousMedicinal"]');
    if (sel) {
        sel.addEventListener('change', function () {
            const box = document.getElementById('prevExpDetails');
            if (box) box.style.display = this.value === 'हाँ' ? 'block' : 'none';
        });
    }
}

// ==========================================
// FORM NAVIGATION
// ==========================================
function initializeForm() {
    document.getElementById('nextBtn').addEventListener('click', () => {
        if (validateCurrentStep()) {
            if (currentStep < totalSteps) {
                currentStep++;
                updateFormDisplay();
            }
        }
    });

    document.getElementById('prevBtn').addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            updateFormDisplay();
        }
    });

    document.getElementById('registrationForm').addEventListener('submit', handleFormSubmit);
}

function updateFormDisplay() {
    document.querySelectorAll('.form-step').forEach((step, index) => {
        step.classList.toggle('active', index + 1 === currentStep);
    });

    document.querySelectorAll('.step-indicator').forEach((indicator, index) => {
        const stepNum = index + 1;
        if (stepNum < currentStep) {
            indicator.classList.add('completed');
            indicator.classList.remove('active');
        } else if (stepNum === currentStep) {
            indicator.classList.add('active');
            indicator.classList.remove('completed');
        } else {
            indicator.classList.remove('active', 'completed');
        }
    });

    document.querySelectorAll('.progress-line').forEach((line, index) => {
        line.classList.toggle('active', index < currentStep - 1);
    });

    document.getElementById('prevBtn').style.display = currentStep === 1 ? 'none' : 'block';
    document.getElementById('nextBtn').style.display = currentStep === totalSteps ? 'none' : 'block';
    document.getElementById('submitBtn').style.display = currentStep === totalSteps ? 'block' : 'none';
    document.getElementById('downloadPdfBtn').style.display = currentStep === totalSteps ? 'block' : 'none';

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goToStep(stepNum) {
    if (stepNum >= 1 && stepNum <= totalSteps) {
        currentStep = stepNum;
        updateFormDisplay();
    }
}

function validateCurrentStep() {
    const stepEl = document.querySelector(`.form-step[data-step="${currentStep}"]`);
    const inputs = stepEl.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (input.type === 'checkbox') {
            if (!input.checked) {
                isValid = false;
                input.parentElement.style.color = '#ef4444';
            } else {
                input.parentElement.style.color = '';
            }
            return;
        }
        if (!input.value.trim()) {
            isValid = false;
            input.style.borderColor = '#ef4444';
            if (!input.nextElementSibling || !input.nextElementSibling.classList.contains('error-msg')) {
                const err = document.createElement('p');
                err.className = 'error-msg';
                err.style.cssText = 'color:#ef4444;font-size:.8rem;margin-top:.2rem;';
                err.textContent = currentLang === 'hi' ? 'यह फील्ड आवश्यक है' : 'This field is required';
                input.parentNode.insertBefore(err, input.nextSibling);
            }
        } else {
            input.style.borderColor = '';
            const errMsg = input.nextElementSibling;
            if (errMsg && errMsg.classList.contains('error-msg')) errMsg.remove();
        }
    });

    if (currentStep === 4 && !photoDataUrl) {
        isValid = false;
        showNotification(
            currentLang === 'hi' ? 'कृपया पासपोर्ट साइज फोटो अपलोड करें' : 'Please upload passport size photo',
            'error'
        );
    }

    if (!isValid) {
        showNotification(
            currentLang === 'hi' ? 'कृपया सभी आवश्यक फील्ड भरें' : 'Please fill all required fields',
            'error'
        );
    }

    return isValid;
}

function validateStep(stepNum) {
    const stepEl = document.querySelector(`.form-step[data-step="${stepNum}"]`);
    if (!stepEl) return true;
    const inputs = stepEl.querySelectorAll('input[required], select[required], textarea[required]');
    let ok = true;
    inputs.forEach(input => {
        if (input.type === 'checkbox') { if (!input.checked) ok = false; }
        else if (!input.value.trim()) ok = false;
    });
    if (stepNum === 4 && !photoDataUrl) ok = false;
    return ok;
}

// ==========================================
// CROP MANAGEMENT
// ==========================================
function initializeCropManagement() {
    document.getElementById('addCropBtn').addEventListener('click', () => {
        const entry = document.createElement('div');
        entry.className = 'crop-entry bg-gray-50 rounded-lg p-4 mb-3';
        entry.innerHTML = `
            <button type="button" class="remove-crop" onclick="this.parentElement.remove()">×</button>
            <div class="grid md:grid-cols-3 gap-3">
                <div class="form-group">
                    <label class="form-label">फसल का नाम *</label>
                    <input type="text" name="cropName[]" required class="form-input" placeholder="जैसे: अश्वगंधा">
                </div>
                <div class="form-group">
                    <label class="form-label">बुवाई माह *</label>
                    <select name="sowingMonth[]" required class="form-input">
                        <option value="">माह चुनें</option>
                        <option>जनवरी</option><option>फरवरी</option><option>मार्च</option>
                        <option>अप्रैल</option><option>मई</option><option>जून</option>
                        <option>जुलाई</option><option>अगस्त</option><option>सितंबर</option>
                        <option>अक्टूबर</option><option>नवंबर</option><option>दिसंबर</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">कटाई माह *</label>
                    <select name="harvestMonth[]" required class="form-input">
                        <option value="">माह चुनें</option>
                        <option>जनवरी</option><option>फरवरी</option><option>मार्च</option>
                        <option>अप्रैल</option><option>मई</option><option>जून</option>
                        <option>जुलाई</option><option>अगस्त</option><option>सितंबर</option>
                        <option>अक्टूबर</option><option>नवंबर</option><option>दिसंबर</option>
                    </select>
                </div>
            </div>`;
        document.getElementById('cropsContainer').appendChild(entry);
    });
}

// ==========================================
// FORM SUBMIT
// ==========================================
async function handleFormSubmit(e) {
    e.preventDefault();

    for (let s = 1; s <= totalSteps; s++) {
        if (!validateStep(s)) {
            const indicator = document.querySelector(`.step-indicator[data-step="${s}"]`);
            if (indicator) {
                indicator.classList.add('has-error', 'vibrating');
                setTimeout(() => indicator.classList.remove('vibrating'), 600);
            }
            currentStep = s;
            updateFormDisplay();
            validateCurrentStep();
            showNotification(
                `Tab ${s} mein kuch fields adhuri hain. Pehle unhe poora karein.`,
                'error'
            );
            return;
        }
    }

    const submitBtn = document.getElementById('submitBtn');
    const submitText = document.getElementById('submitText');
    const submitLoader = document.getElementById('submitLoader');

    submitBtn.disabled = true;
    submitText.style.display = 'none';
    submitLoader.style.display = 'inline';

    try {
        const formData = collectFormData();
        const pdfBlob = await generatePDF(formData);
        await sendPDFToTelegram(pdfBlob, formData);
        // After successful send, go to success page or show message
        showSuccessScreen(formData.regNumber);
    } catch (error) {
        console.error('Submission error:', error);
        showNotification('फॉर्म जमा करने में त्रुटि हुई। कृपया पुनः प्रयास करें। ' + error.message, 'error');
        submitBtn.disabled = false;
        submitText.style.display = 'inline';
        submitLoader.style.display = 'none';
    }
}

function showSuccessScreen(regNumber) {
    document.querySelector('.container').innerHTML = `
        <div style="text-align:center;padding:3rem 1.5rem;background:#fff;border-radius:1rem;box-shadow:0 4px 24px rgba(0,0,0,.1);">
            <div style="width:80px;height:80px;background:#1b3a1a;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 1.5rem;">
                <svg width="40" height="40" fill="none" stroke="#fff" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
            </div>
            <h2 style="font-size:1.5rem;font-weight:700;color:#1b3a1a;margin-bottom:.5rem;">🎉 पंजीकरण सफल हुआ!</h2>
            <p style="color:#6b7280;margin-bottom:1rem;">आपका फॉर्म सफलतापूर्वक जमा हो गया है।</p>
            <div style="background:#f5f0e8;border-radius:.5rem;padding:1rem;display:inline-block;margin-bottom:1.5rem;">
                <p style="color:#1b3a1a;font-weight:700;font-size:1.1rem;">पंजीकरण संख्या: ${regNumber}</p>
            </div>
            <p style="color:#374151;font-size:.9rem;">हमारे प्रतिनिधि आपसे जल्द संपर्क करेंगे।<br>किसी सहायता के लिए: <strong>7250915077</strong></p>
        </div>`;
}

// ==========================================
// COLLECT FORM DATA
// ==========================================
function collectFormData() {
    const fd = new FormData(document.getElementById('registrationForm'));
    const cropNames = fd.getAll('cropName[]');
    const sowingMonths = fd.getAll('sowingMonth[]');
    const harvestMonths = fd.getAll('harvestMonth[]');
    const crops = cropNames.map((name, i) => ({
        name,
        sowingMonth: sowingMonths[i] || '',
        harvestMonth: harvestMonths[i] || ''
    }));

    const today = new Date();
    const regDate = `${String(today.getDate()).padStart(2,'0')}/${String(today.getMonth()+1).padStart(2,'0')}/${today.getFullYear()}`;

    return {
        regNumber: generateRegNumber(),
        regDate,
        fullName:            fd.get('fullName') || '',
        fatherName:          fd.get('fatherName') || '',
        gender:              fd.get('gender') || '',
        dob:                 fd.get('dob') ? formatDate(fd.get('dob')) : '',
        age:                 fd.get('age') || '',
        phone:               fd.get('phone') || '',
        village:             fd.get('village') || '',
        panchayat:           fd.get('panchayat') || '',
        block:               fd.get('block') || '',
        district:            fd.get('district') || '',
        state:               fd.get('state') || '',
        irrigatedArea:       fd.get('irrigatedArea') || '0',
        irrigatedOwnership:  fd.get('irrigatedOwnership') || '',
        unirrigatedArea:     fd.get('unirrigatedArea') || '0',
        unirrigatedOwnership:fd.get('unirrigatedOwnership') || 'लागू नहीं',
        shgMember:           fd.get('shgMember') || '',
        shgName:             fd.get('shgName') || '',
        crops,
        previousMedicinal:   fd.get('previousMedicinal') || '',
        prevExpDescription:  fd.get('prevExpDescription') || '',
        photo:               photoDataUrl,
        submittedAt:         new Date().toLocaleString('hi-IN', { timeZone: 'Asia/Kolkata' })
    };
}

function generateRegNumber() {
    const n = new Date();
    return `AY${n.getFullYear()}${String(n.getMonth()+1).padStart(2,'0')}${String(n.getDate()).padStart(2,'0')}${String(n.getHours()).padStart(2,'0')}${String(n.getMinutes()).padStart(2,'0')}`;
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
}

// ==========================================
// PDF GENERATION (compact, no sensitive docs)
// ==========================================
async function generatePDF(data) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    const W = 210;
    const margin = 14;
    let y = 14;

    const BRAND_R = 27, BRAND_G = 58, BRAND_B = 26;

    function checkPage(needed) {
        if (y + needed > 270) { doc.addPage(); y = 14; }
    }

    function sectionTitle(text, yPos) {
        doc.setFillColor(BRAND_R, BRAND_G, BRAND_B);
        doc.rect(margin, yPos, W - margin*2, 7, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(8.5);
        doc.setFont('helvetica', 'bold');
        doc.text(text, margin + 3, yPos + 5);
        doc.setTextColor(0, 0, 0);
        return yPos + 10;
    }

    function field(label, value, xL, yF, wL, wV) {
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.text(label, xL, yF);
        doc.setFont('helvetica', 'normal');
        const valX = xL + wL + 1;
        doc.text(String(value || '-'), valX, yF, { maxWidth: wV });
        doc.setDrawColor(200, 200, 200);
        doc.line(valX, yF + 0.5, valX + wV, yF + 0.5);
    }

    // ===== HEADER BAR =====
    doc.setFillColor(BRAND_R, BRAND_G, BRAND_B);
    doc.rect(0, 0, W, 16, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Aushadhiyog Pvt. Ltd.', W/2, 7, { align: 'center' });
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text('aushadhiyog@gmail.com | 7250915077 | NH-23, Palkoat Road, Gumla, Jharkhand', W/2, 12, { align: 'center' });
    doc.setTextColor(0, 0, 0);

    y = 20;

    // Form title
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(BRAND_R, BRAND_G, BRAND_B);
    doc.text('KISAN PANJIKARAN PRAPATRA', W/2, y, { align: 'center' });
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text('(Aushadhiya evam Sugandhi Fasal - Anubandhi Kheti)', W/2, y+5, { align: 'center' });
    doc.setTextColor(0, 0, 0);
    y += 10;

    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y, W - margin, y);
    y += 4;

    // Reg info + photo box
    const photoBoxX = W - margin - 28;
    const photoBoxY = y;
    const photoBoxW = 28;
    const photoBoxH = 36;

    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('Panjikaran Sankhya:', margin, y + 4);
    doc.setFont('helvetica', 'normal');
    doc.text(data.regNumber, margin + 33, y + 4);

    doc.setFont('helvetica', 'bold');
    doc.text('Tithi:', margin, y + 10);
    doc.setFont('helvetica', 'normal');
    doc.text(data.regDate, margin + 13, y + 10);

    // Photo box
    doc.setDrawColor(100, 100, 100);
    doc.setLineWidth(0.5);
    doc.rect(photoBoxX, photoBoxY, photoBoxW, photoBoxH);
    if (data.photo) {
        try { doc.addImage(data.photo, 'JPEG', photoBoxX+0.5, photoBoxY+0.5, photoBoxW-1, photoBoxH-1); }
        catch(e) {
            doc.setFontSize(7); doc.setTextColor(150,150,150);
            doc.text('Photo', photoBoxX+photoBoxW/2, photoBoxY+photoBoxH/2, { align:'center' });
            doc.setTextColor(0,0,0);
        }
    } else {
        doc.setFontSize(7); doc.setTextColor(150,150,150);
        doc.text('Passport', photoBoxX+photoBoxW/2, photoBoxY+photoBoxH/2-2, { align:'center' });
        doc.text('Photo', photoBoxX+photoBoxW/2, photoBoxY+photoBoxH/2+3, { align:'center' });
        doc.setTextColor(0,0,0);
    }
    doc.setFontSize(6.5);
    doc.text('Passport Size Photo', photoBoxX+photoBoxW/2, photoBoxY+photoBoxH+4, { align:'center' });

    y += photoBoxH + 8;

    // ===== SECTION 1: Personal Details =====
    y = sectionTitle('1. Vyaktigat Vivaran (Personal Details)', y);
    const col1 = margin, col2 = W/2 + 5;

    field('Naam:', data.fullName, col1, y, 14, 72);
    y += 7;
    field('Pita/Pati:', data.fatherName, col1, y, 18, 68);
    y += 7;
    field('Ling:', data.gender, col1, y, 12, 25);
    field('Janm Tithi:', data.dob, col1+45, y, 20, 25);
    field('Aayu:', data.age + ' Varsh', col1+95, y, 12, 20);
    y += 7;
    field('Mobile:', data.phone, col1, y, 16, 40);
    y += 9;

    // ===== SECTION 2: Address =====
    checkPage(40);
    y = sectionTitle('2. Pata Vivaran (Address)', y);

    field('Gram:', data.village, col1, y, 12, 55);
    field('Panchayat:', data.panchayat, col2, y, 22, 40);
    y += 7;
    field('Prakhanda:', data.block, col1, y, 20, 47);
    field('Jila:', data.district, col2, y, 12, 50);
    y += 7;
    field('Rajya:', data.state, col1, y, 14, 60);
    y += 9;

    // ===== SECTION 3: Land Details =====
    checkPage(40);
    y = sectionTitle('3. Bhoomi Vivaran (Land Details)', y);

    // Table header
    doc.setFillColor(240, 253, 244);
    doc.rect(margin, y, W-margin*2, 6, 'F');
    doc.setFontSize(8); doc.setFont('helvetica', 'bold');
    const lc = [margin, margin+50, margin+90, margin+130];
    doc.text('Bhoomi Prakar', lc[0]+1, y+4);
    doc.text('Kshetra (Acre)', lc[1]+1, y+4);
    doc.text('Swamitva', lc[2]+1, y+4);
    doc.setDrawColor(180,180,180);
    doc.rect(margin, y, W-margin*2, 6);
    y += 6;

    doc.setFont('helvetica', 'normal');
    doc.rect(margin, y, W-margin*2, 6);
    doc.text('Sinchai (Irrigated)', lc[0]+1, y+4);
    doc.text(data.irrigatedArea, lc[1]+1, y+4);
    doc.text(data.irrigatedOwnership, lc[2]+1, y+4);
    y += 6;
    doc.rect(margin, y, W-margin*2, 6);
    doc.text('Asinchai (Unirrigated)', lc[0]+1, y+4);
    doc.text(data.unirrigatedArea, lc[1]+1, y+4);
    doc.text(data.unirrigatedOwnership, lc[2]+1, y+4);
    y += 9;

    // ===== SECTION 4: SHG/FPO =====
    checkPage(18);
    y = sectionTitle('4. Samuh / Sangathan (SHG/FPO)', y);
    field('Sadasya:', data.shgMember, col1, y, 18, 20);
    if (data.shgMember === 'हाँ' && data.shgName) {
        field('Naam:', data.shgName, col2, y, 12, 55);
    }
    y += 9;

    // ===== SECTION 5: Crop Details =====
    checkPage(30 + data.crops.length * 7);
    y = sectionTitle('5. Prastaavit Fasal Vivaran (Crop Details)', y);

    doc.setFillColor(240, 253, 244);
    doc.rect(margin, y, W-margin*2, 6, 'F');
    doc.setFontSize(8); doc.setFont('helvetica', 'bold');
    const cc = [margin, margin+65, margin+110, margin+150];
    doc.text('Fasal ka Naam', cc[0]+1, y+4);
    doc.text('Buwai Maah', cc[1]+1, y+4);
    doc.text('Katai Maah', cc[2]+1, y+4);
    doc.setDrawColor(180,180,180);
    doc.rect(margin, y, W-margin*2, 6);
    y += 6;

    doc.setFont('helvetica', 'normal');
    data.crops.forEach((crop, i) => {
        checkPage(7);
        doc.rect(margin, y, W-margin*2, 6);
        doc.text(`${i+1}. ${crop.name || ''}`, cc[0]+1, y+4);
        doc.text(crop.sowingMonth || '', cc[1]+1, y+4);
        doc.text(crop.harvestMonth || '', cc[2]+1, y+4);
        y += 6;
    });
    y += 4;

    // ===== SECTION 6: Previous Experience =====
    checkPage(20);
    y = sectionTitle('6. Poorv Anubhav (Previous Experience)', y);
    field('Kya pehle Aushadhiya Fasal ugaai?', data.previousMedicinal, col1, y, 72, 20);
    y += 7;
    if (data.previousMedicinal === 'हाँ' && data.prevExpDescription) {
        doc.setFontSize(8); doc.setFont('helvetica', 'bold');
        doc.text('Vivaran:', col1, y);
        doc.setFont('helvetica', 'normal');
        const lines = doc.splitTextToSize(data.prevExpDescription, W - margin*2 - 20);
        doc.text(lines, col1 + 18, y);
        y += lines.length * 4.5 + 2;
    }
    y += 3;

    // ===== SECTION 7: Declaration =====
    checkPage(28);
    y = sectionTitle('7. Ghoshana (Declaration)', y);
    doc.setFontSize(7.5); doc.setFont('helvetica', 'normal');
    const decl = 'Main yah ghoshit karta/karti hun ki di gayi sabhi jaankaari satya hai aur maine Aushadhiyog ke niyam evam shartein padh li hain tatha unse sahmat hun. Yadi koi jaankaari galat payi jaati hai, to panjikaran nirasht kiya ja sakta hai.';
    const declLines = doc.splitTextToSize(decl, W - margin*2 - 4);
    doc.text(declLines, col1+2, y);
    y += declLines.length * 4.2 + 6;

    // ===== SIGNATURES =====
    checkPage(35);
    y = sectionTitle('8. Hastaakshar (Signatures)', y);
    y += 8;
    const sigW = (W - margin*2 - 10) / 2;
    doc.setDrawColor(120, 120, 120);
    doc.rect(margin, y, sigW, 22);
    doc.rect(margin + sigW + 10, y, sigW, 22);
    doc.setFontSize(7.5); doc.setFont('helvetica', 'bold');
    doc.text('Kisan Hastaakshar / Angutha Nishan', margin + sigW/2, y + 27, { align: 'center' });
    doc.text('Naam: ' + data.fullName, margin + 2, y + 24);
    doc.text('Company Pratinidhi', margin + sigW + 10 + sigW/2, y + 27, { align: 'center' });
    y += 32;

    // ===== FOOTER =====
    checkPage(10);
    doc.setFillColor(BRAND_R, BRAND_G, BRAND_B);
    doc.rect(0, y, W, 10, 'F');
    doc.setTextColor(255, 255, 255); doc.setFontSize(7); doc.setFont('helvetica', 'normal');
    doc.text(`Submitted: ${data.submittedAt} | Reg No: ${data.regNumber}`, W/2, y + 6, { align: 'center' });

    return doc.output('blob');
}

// ==========================================
// DOWNLOAD PDF (for user)
// ==========================================
async function downloadPDFPreview() {
    try {
        const formData = collectFormData();
        const pdfBlob = await generatePDF(formData);
        const url = URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Kisan_Registration_${formData.regNumber}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
    } catch (e) {
        showNotification('PDF download mein error: ' + e.message, 'error');
    }
}

// ==========================================
// SEND PDF TO TELEGRAM
// ==========================================
// HOW TO SET UP TELEGRAM:
// 1. Open Telegram → search @BotFather → /newbot
// 2. Follow steps to create/access your bot
// 3. Copy the bot token shown (format: 123456:ABCdef...)
// 4. Add the bot to your group/channel as ADMIN
// 5. Send any message in the group
// 6. Open: https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates
// 7. Look for "chat":{"id": -100xxxxxxxxx} — that's your chat_id
// 8. Paste both values in CONFIG at top of this file

async function sendPDFToTelegram(pdfBlob, data) {
    const fileName = `Kisan_Registration_${data.regNumber}.pdf`;

    // Verify config is set
    if (CONFIG.telegramBotToken.includes('APNA') || CONFIG.telegramChatId.includes('APNA')) {
        console.warn('Telegram config not set. Please update CONFIG in app.js');
        showNotification('Telegram config set nahi hai — app.js mein CONFIG update karein', 'error');
        throw new Error('Telegram config missing');
    }

    const formDataTg = new FormData();
    formDataTg.append('chat_id', CONFIG.telegramChatId);
    formDataTg.append('document', pdfBlob, fileName);

    const caption =
        `🌱 *Naya Kisan Panjikaran*\n` +
        `━━━━━━━━━━━━━━━━━━━━\n` +
        `👤 *Naam:* ${data.fullName}\n` +
        `📱 *Mobile:* ${data.phone}\n` +
        `📍 *Sthan:* ${data.district}, ${data.state}\n` +
        `🌾 *Bhoomi:* Sinchai: ${data.irrigatedArea} Acre | Asinchai: ${data.unirrigatedArea} Acre\n` +
        `🌿 *Fasalein:* ${data.crops.map(c => c.name).join(', ')}\n` +
        `🆔 *Reg No:* ${data.regNumber}\n` +
        `⏰ *Samay:* ${data.submittedAt}`;

    formDataTg.append('caption', caption);
    formDataTg.append('parse_mode', 'Markdown');

    const response = await fetch(
        `https://api.telegram.org/bot${CONFIG.telegramBotToken}/sendDocument`,
        { method: 'POST', body: formDataTg }
    );

    const result = await response.json();
    if (!result.ok) {
        console.error('Telegram error:', result);
        const errMsg = result.description || 'Unknown error';
        throw new Error(`Telegram: ${errMsg}`);
    }
}

// ==========================================
// NOTIFICATION
// ==========================================
function showNotification(message, type = 'info') {
    const existing = document.querySelectorAll('.site-notification');
    existing.forEach(n => n.remove());

    const bg = type === 'success' ? '#1b3a1a' : type === 'error' ? '#ef4444' : '#3b82f6';
    const n = document.createElement('div');
    n.className = 'site-notification';
    n.style.cssText = `position:fixed;top:1rem;right:1rem;z-index:99999;padding:.875rem 1.25rem;border-radius:.5rem;box-shadow:0 4px 16px rgba(0,0,0,.25);background:${bg};color:#fff;max-width:300px;font-size:.875rem;transition:opacity .3s;`;
    n.textContent = message;
    document.body.appendChild(n);
    setTimeout(() => { if (document.body.contains(n)) { n.style.opacity = '0'; setTimeout(() => n.remove(), 300); } }, 4500);
}

// ==========================================
// LOCATION DATA
// ==========================================
const locationData = {
    "Andhra Pradesh": { districts: ["Anantapur","Chittoor","East Godavari","Guntur","Krishna","Kurnool","Nellore","Prakasam","Srikakulam","Visakhapatnam","Vizianagaram","West Godavari","YSR Kadapa"] },
    "Arunachal Pradesh": { districts: ["Anjaw","Changlang","East Kameng","East Siang","Kamle","Kurung Kumey","Lohit","Longding","Lower Dibang Valley","Lower Siang","Lower Subansiri","Namsai","Papum Pare","Tawang","Tirap","Upper Dibang Valley","Upper Siang","Upper Subansiri","West Kameng","West Siang"] },
    "Assam": { districts: ["Baksa","Barpeta","Biswanath","Bongaigaon","Cachar","Charaideo","Darrang","Dhemaji","Dhubri","Dibrugarh","Dima Hasao","Goalpara","Golaghat","Hailakandi","Hojai","Jorhat","Kamrup","Kamrup Metropolitan","Karbi Anglong","Karimganj","Kokrajhar","Lakhimpur","Majuli","Morigaon","Nagaon","Nalbari","Sivasagar","Sonitpur","Tinsukia","Udalguri"] },
    "Bihar": { districts: ["Araria","Arwal","Aurangabad","Banka","Begusarai","Bhagalpur","Bhojpur","Buxar","Darbhanga","East Champaran","Gaya","Gopalganj","Jamui","Jehanabad","Kaimur","Katihar","Khagaria","Kishanganj","Lakhisarai","Madhepura","Madhubani","Munger","Muzaffarpur","Nalanda","Nawada","Patna","Purnia","Rohtas","Saharsa","Samastipur","Saran","Sheikhpura","Sheohar","Sitamarhi","Siwan","Supaul","Vaishali","West Champaran"] },
    "Chhattisgarh": { districts: ["Balod","Baloda Bazar","Balrampur","Bastar","Bemetara","Bijapur","Bilaspur","Dantewada","Dhamtari","Durg","Gariaband","Janjgir-Champa","Jashpur","Kabirdham","Kanker","Kondagaon","Korba","Koriya","Mahasamund","Mungeli","Narayanpur","Raigarh","Raipur","Rajnandgaon","Sukma","Surajpur","Surguja"] },
    "Goa": { districts: ["North Goa","South Goa"] },
    "Gujarat": { districts: ["Ahmedabad","Amreli","Anand","Aravalli","Banaskantha","Bharuch","Bhavnagar","Botad","Chhota Udaipur","Dahod","Dang","Gandhinagar","Gir Somnath","Jamnagar","Junagadh","Kheda","Kutch","Mahisagar","Mehsana","Morbi","Narmada","Navsari","Panchmahal","Patan","Porbandar","Rajkot","Sabarkantha","Surat","Surendranagar","Tapi","Vadodara","Valsad"] },
    "Haryana": { districts: ["Ambala","Bhiwani","Charkhi Dadri","Faridabad","Fatehabad","Gurugram","Hisar","Jhajjar","Jind","Kaithal","Karnal","Kurukshetra","Mahendragarh","Nuh","Palwal","Panchkula","Panipat","Rewari","Rohtak","Sirsa","Sonipat","Yamunanagar"] },
    "Himachal Pradesh": { districts: ["Bilaspur","Chamba","Hamirpur","Kangra","Kinnaur","Kullu","Lahaul and Spiti","Mandi","Shimla","Sirmaur","Solan","Una"] },
    "Jharkhand": { districts: ["Bokaro","Chatra","Deoghar","Dhanbad","Dumka","East Singhbhum","Garhwa","Giridih","Godda","Gumla","Hazaribagh","Jamtara","Khunti","Koderma","Latehar","Lohardaga","Pakur","Palamu","Ramgarh","Ranchi","Sahebganj","Seraikela Kharsawan","Simdega","West Singhbhum"] },
    "Karnataka": { districts: ["Bagalkot","Ballari","Belagavi","Bengaluru Rural","Bengaluru Urban","Bidar","Chamarajanagar","Chikkaballapur","Chikkamagaluru","Chitradurga","Dakshina Kannada","Davanagere","Dharwad","Gadag","Hassan","Haveri","Kalaburagi","Kodagu","Kolar","Koppal","Mandya","Mysuru","Raichur","Ramanagara","Shivamogga","Tumakuru","Udupi","Uttara Kannada","Vijayapura","Yadgir"] },
    "Kerala": { districts: ["Alappuzha","Ernakulam","Idukki","Kannur","Kasaragod","Kollam","Kottayam","Kozhikode","Malappuram","Palakkad","Pathanamthitta","Thiruvananthapuram","Thrissur","Wayanad"] },
    "Madhya Pradesh": { districts: ["Agar Malwa","Alirajpur","Anuppur","Ashoknagar","Balaghat","Barwani","Betul","Bhind","Bhopal","Burhanpur","Chhatarpur","Chhindwara","Damoh","Datia","Dewas","Dhar","Dindori","Guna","Gwalior","Harda","Hoshangabad","Indore","Jabalpur","Jhabua","Katni","Khandwa","Khargone","Mandla","Mandsaur","Morena","Narsinghpur","Neemuch","Panna","Raisen","Rajgarh","Ratlam","Rewa","Sagar","Satna","Sehore","Seoni","Shahdol","Shajapur","Sheopur","Shivpuri","Sidhi","Singrauli","Tikamgarh","Ujjain","Umaria","Vidisha"] },
    "Maharashtra": { districts: ["Ahmednagar","Akola","Amravati","Aurangabad","Beed","Bhandara","Buldhana","Chandrapur","Dhule","Gadchiroli","Gondia","Hingoli","Jalgaon","Jalna","Kolhapur","Latur","Mumbai City","Mumbai Suburban","Nagpur","Nanded","Nandurbar","Nashik","Osmanabad","Palghar","Parbhani","Pune","Raigad","Ratnagiri","Sangli","Satara","Sindhudurg","Solapur","Thane","Wardha","Washim","Yavatmal"] },
    "Manipur": { districts: ["Bishnupur","Chandel","Churachandpur","Imphal East","Imphal West","Jiribam","Kakching","Kamjong","Kangpokpi","Noney","Pherzawl","Senapati","Tamenglong","Tengnoupal","Thoubal","Ukhrul"] },
    "Meghalaya": { districts: ["East Garo Hills","East Jaintia Hills","East Khasi Hills","Eastern West Khasi Hills","North Garo Hills","Ri Bhoi","South Garo Hills","South West Garo Hills","South West Khasi Hills","West Garo Hills","West Jaintia Hills","West Khasi Hills"] },
    "Mizoram": { districts: ["Aizawl","Champhai","Hnahthial","Khawzawl","Kolasib","Lawngtlai","Lunglei","Mamit","Saiha","Saitual","Serchhip"] },
    "Nagaland": { districts: ["Dimapur","Kiphire","Kohima","Longleng","Mokokchung","Mon","Noklak","Peren","Phek","Tuensang","Wokha","Zunheboto"] },
    "Odisha": { districts: ["Angul","Balangir","Balasore","Bargarh","Bhadrak","Boudh","Cuttack","Deogarh","Dhenkanal","Gajapati","Ganjam","Jagatsinghpur","Jajpur","Jharsuguda","Kalahandi","Kandhamal","Kendrapara","Kendujhar","Khordha","Koraput","Malkangiri","Mayurbhanj","Nabarangpur","Nayagarh","Nuapada","Puri","Rayagada","Sambalpur","Subarnapur","Sundergarh"] },
    "Punjab": { districts: ["Amritsar","Barnala","Bathinda","Faridkot","Fatehgarh Sahib","Fazilka","Ferozepur","Gurdaspur","Hoshiarpur","Jalandhar","Kapurthala","Ludhiana","Mansa","Moga","Mohali","Muktsar","Nawanshahr","Pathankot","Patiala","Rupnagar","Sangrur","Tarn Taran"] },
    "Rajasthan": { districts: ["Ajmer","Alwar","Banswara","Baran","Barmer","Bharatpur","Bhilwara","Bikaner","Bundi","Chittorgarh","Churu","Dausa","Dholpur","Dungarpur","Ganganagar","Hanumangarh","Jaipur","Jaisalmer","Jalore","Jhalawar","Jhunjhunu","Jodhpur","Karauli","Kota","Nagaur","Pali","Pratapgarh","Rajsamand","Sawai Madhopur","Sikar","Sirohi","Tonk","Udaipur"] },
    "Sikkim": { districts: ["East Sikkim","North Sikkim","Pakyong","Soreng","South Sikkim","West Sikkim"] },
    "Tamil Nadu": { districts: ["Ariyalur","Chengalpattu","Chennai","Coimbatore","Cuddalore","Dharmapuri","Dindigul","Erode","Kallakurichi","Kancheepuram","Kanyakumari","Karur","Krishnagiri","Madurai","Mayiladuthurai","Nagapattinam","Namakkal","Nilgiris","Perambalur","Pudukkottai","Ramanathapuram","Ranipet","Salem","Sivaganga","Tenkasi","Thanjavur","Theni","Thoothukudi","Tiruchirappalli","Tirunelveli","Tirupathur","Tiruppur","Tiruvallur","Tiruvannamalai","Tiruvarur","Vellore","Viluppuram","Virudhunagar"] },
    "Telangana": { districts: ["Adilabad","Bhadradri Kothagudem","Hyderabad","Jagtial","Jangaon","Jayashankar Bhupalpally","Jogulamba Gadwal","Kamareddy","Karimnagar","Khammam","Kumuram Bheem","Mahabubabad","Mahabubnagar","Mancherial","Medak","Medchal","Mulugu","Nagarkurnool","Nalgonda","Narayanpet","Nirmal","Nizamabad","Peddapalli","Rajanna Sircilla","Rangareddy","Sangareddy","Siddipet","Suryapet","Vikarabad","Wanaparthy","Warangal Rural","Warangal Urban","Yadadri Bhuvanagiri"] },
    "Tripura": { districts: ["Dhalai","Gomati","Khowai","North Tripura","Sepahijala","South Tripura","Unakoti","West Tripura"] },
    "Uttar Pradesh": { districts: ["Agra","Aligarh","Ambedkar Nagar","Amethi","Amroha","Auraiya","Ayodhya","Azamgarh","Baghpat","Bahraich","Ballia","Balrampur","Banda","Barabanki","Bareilly","Basti","Bhadohi","Bijnor","Budaun","Bulandshahr","Chandauli","Chitrakoot","Deoria","Etah","Etawah","Farrukhabad","Fatehpur","Firozabad","Gautam Buddha Nagar","Ghaziabad","Ghazipur","Gonda","Gorakhpur","Hamirpur","Hapur","Hardoi","Hathras","Jalaun","Jaunpur","Jhansi","Kannauj","Kanpur Dehat","Kanpur Nagar","Kasganj","Kaushambi","Kheri","Kushinagar","Lalitpur","Lucknow","Maharajganj","Mahoba","Mainpuri","Mathura","Mau","Meerut","Mirzapur","Moradabad","Muzaffarnagar","Pilibhit","Pratapgarh","Prayagraj","Raebareli","Rampur","Saharanpur","Sambhal","Sant Kabir Nagar","Shahjahanpur","Shamli","Shravasti","Siddharthnagar","Sitapur","Sonbhadra","Sultanpur","Unnao","Varanasi"] },
    "Uttarakhand": { districts: ["Almora","Bageshwar","Chamoli","Champawat","Dehradun","Haridwar","Nainital","Pauri Garhwal","Pithoragarh","Rudraprayag","Tehri Garhwal","Udham Singh Nagar","Uttarkashi"] },
    "West Bengal": { districts: ["Alipurduar","Bankura","Birbhum","Cooch Behar","Dakshin Dinajpur","Darjeeling","Hooghly","Howrah","Jalpaiguri","Jhargram","Kalimpong","Kolkata","Malda","Murshidabad","Nadia","North 24 Parganas","Paschim Bardhaman","Paschim Medinipur","Purba Bardhaman","Purba Medinipur","Purulia","South 24 Parganas","Uttar Dinajpur"] },
    "Andaman and Nicobar Islands": { districts: ["North and Middle Andaman","South Andaman","Nicobar"] },
    "Chandigarh": { districts: ["Chandigarh"] },
    "Dadra and Nagar Haveli and Daman and Diu": { districts: ["Dadra and Nagar Haveli","Daman","Diu"] },
    "Delhi": { districts: ["Central Delhi","East Delhi","New Delhi","North Delhi","North East Delhi","North West Delhi","Shahdara","South Delhi","South East Delhi","South West Delhi","West Delhi"] },
    "Jammu and Kashmir": { districts: ["Anantnag","Bandipora","Baramulla","Budgam","Doda","Ganderbal","Jammu","Kathua","Kishtwar","Kulgam","Kupwara","Poonch","Pulwama","Rajouri","Ramban","Reasi","Samba","Shopian","Srinagar","Udhampur"] },
    "Ladakh": { districts: ["Kargil","Leh"] },
    "Lakshadweep": { districts: ["Lakshadweep"] },
    "Puducherry": { districts: ["Karaikal","Mahe","Puducherry","Yanam"] }
};

function populateStates() {
    const stateSelect = document.getElementById('stateSelect');
    if (!stateSelect) return;
    Object.keys(locationData).sort().forEach(state => {
        const opt = document.createElement('option');
        opt.value = state;
        opt.textContent = state;
        stateSelect.appendChild(opt);
    });
}

function onStateChange() {
    const stateVal = document.getElementById('stateSelect').value;
    const districtSelect = document.getElementById('districtSelect');
    districtSelect.innerHTML = '<option value="">जिला चुनें</option>';
    districtSelect.disabled = true;

    if (!stateVal || !locationData[stateVal]) return;

    const districts = locationData[stateVal].districts;
    const arr = Array.isArray(districts) ? districts : Object.keys(districts);
    arr.sort().forEach(d => {
        const opt = document.createElement('option');
        opt.value = d;
        opt.textContent = d;
        districtSelect.appendChild(opt);
    });
    districtSelect.disabled = false;
}
