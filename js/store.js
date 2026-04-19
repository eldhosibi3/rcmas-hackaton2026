const Store = {
    catalogs: {
        departments: ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'General Medicine', 'Dermatology'],
        medicines: [
            { id: 'M1', name: 'Paracetamol 500mg', price: 50 },
            { id: 'M2', name: 'Amoxicillin 250mg', price: 120 },
            { id: 'M3', name: 'Cough Syrup 100ml', price: 85 },
            { id: 'M4', name: 'Vitamin C Complex', price: 40 },
            { id: 'M5', name: 'Ibuprofen 400mg', price: 60 }
        ],
        labTests: [
            { id: 'L1', name: 'Complete Blood Count (CBC)', price: 400, params: ['Red Blood Cells (M/mcL)', 'White Blood Cells (K/mcL)', 'Hemoglobin (g/dL)', 'Platelets (K/mcL)'] },
            { id: 'L2', name: 'Blood Sugar Fasting', price: 200, params: ['Fasting Blood Glucose (mg/dL)'] },
            { id: 'L3', name: 'Lipid Profile', price: 600, params: ['Total Cholesterol (mg/dL)', 'HDL (mg/dL)', 'LDL (mg/dL)', 'Triglycerides (mg/dL)'] },
            { id: 'L4', name: 'Liver Function Test (LFT)', price: 750, params: ['Bilirubin Total (mg/dL)', 'ALT/SGPT (U/L)', 'AST/SGOT (U/L)'] },
            { id: 'L5', name: 'X-Ray Chest', price: 500, params: ['Radiologist Findings'] }
        ]
    },
    data: {
        patients: [], // { id: 'P1001', name, phone, password, records: [], prescriptions: [] }
        employees: [], // { id: 'E1001', name, role, department, password }
        appointments: [], // { id, token, patientId, doctorId, date, time, status }
        labResults: [], // { id, patientId, resultDetails, date }
        blockedSlots: [], // { id, doctorId, date, time }
        labRequests: [],  // { id, patientId, doctorId, details, date, status }
        currentUser: null // { id, role, name, ... }
    },
    
    init() {
        const saved = localStorage.getItem('hospital_db');
        if (saved) {
            this.data = { ...this.data, ...JSON.parse(saved) };
        }
        
        let changed = false;
        // Inject dummy doctors
        if(!this.data.employees.find(e => e.role === 'Doctor')) {
            this.data.employees.push({ id: 'E1001', name: 'Dr. Gregory House', role: 'Doctor', department: 'General Medicine', password: '123' });
            this.data.employees.push({ id: 'E1002', name: 'Dr. Allison Cameron', role: 'Doctor', department: 'Cardiology', password: '123' });
            this.data.employees.push({ id: 'E1003', name: 'Dr. Robert Chase', role: 'Doctor', department: 'Neurology', password: '123' });
            changed = true;
        }
        // Inject dummy lab/pharmacy
        if(!this.data.employees.find(e => e.role === 'Pharmacist')) {
            this.data.employees.push({ id: 'E1004', name: 'Mike (Pharmacy)', role: 'Pharmacist', department: 'Pharmacy', password: '123' });
            changed = true;
        }
        if(!this.data.employees.find(e => e.role === 'Lab Assistant')) {
            this.data.employees.push({ id: 'E1005', name: 'Emma (Lab)', role: 'Lab Assistant', department: 'Laboratory', password: '123' });
            changed = true;
        }
        // Inject dummy patients
        if(this.data.patients.length === 0) {
            this.data.patients.push({ id: 'P1001', name: 'John Doe', phone: '9876543210', password: '123', records: [], prescriptions: [] });
            this.data.patients.push({ id: 'P1002', name: 'Jane Smith', phone: '9876543211', password: '123', records: [], prescriptions: [] });
            changed = true;
        }
        // Inject additional new dummy ones as requested
        if(!this.data.patients.find(p => p.id === 'P1003')) {
            this.data.patients.push({ id: 'P1003', name: 'Alice Johnson', phone: '9876543212', password: '123', records: [], prescriptions: [] });
            this.data.patients.push({ id: 'P1004', name: 'Bob Williams', phone: '9876543213', password: '123', records: [], prescriptions: [] });
            this.data.patients.push({ id: 'P1005', name: 'Charlie Brown', phone: '9876543214', password: '123', records: [], prescriptions: [] });
            this.data.employees.push({ id: 'E1006', name: 'Dr. John Watson', role: 'Doctor', department: 'Orthopedics', password: '123' });
            this.data.employees.push({ id: 'E1007', name: 'Dr. Meredith Grey', role: 'Doctor', department: 'General Medicine', password: '123' });
            changed = true;
        }
        if(changed) {
            this.save();
        }

        if(!this.data.cms) {
            this.data.cms = {
                hospitalName: 'Global Multispeciality',
                slogan: 'PREMIUM HEALTHCARE',
                heroDescription: 'Providing world-class medical excellence for our community in Kakkanad. State-of-the-art facilities, renowned experts, and compassionate care.',
                heroImage: 'img/hero.png',
                contactPhone: '+91 800-123-4567',
                contactEmail: 'care@globalhospital.com',
                logo: 'img/logo.png'
            };
            this.save();
        }
    },

    save() {
        localStorage.setItem('hospital_db', JSON.stringify(this.data));
    },

    updateCMS(updates) {
        this.data.cms = { ...this.data.cms, ...updates };
        this.save();
        return true;
    },

    // --- Authentication --- //
    login(id, password, type) {
        if (type === 'admin') {
            if (id === 'ADMIN' && password === '1234') {
                this.data.currentUser = { id: 'ADMIN', role: 'admin', name: 'Administrator' };
                this.save();
                return { success: true, role: 'admin' };
            }
            return { success: false, msg: 'Invalid admin credentials' };
        }

        if (type === 'patient') {
            const p = this.data.patients.find(x => (x.id === id || x.phone === id) && x.password === password);
            if (p) {
                this.data.currentUser = { ...p, role: 'patient' };
                this.save();
                return { success: true, role: 'patient' };
            }
            return { success: false, msg: 'Invalid Patient ID/Mobile Number or password' };
        }

        if (type === 'employee') {
            const e = this.data.employees.find(x => x.id === id && x.password === password);
            if (e) {
                this.data.currentUser = { ...e };
                this.save();
                return { success: true, role: e.role };
            }
            return { success: false, msg: 'Invalid employee ID or password' };
        }
    },

    logout() {
        this.data.currentUser = null;
        this.save();
    },

    // --- Features --- //
    generateId(prefix, list) {
        const num = list.length + 1001;
        return `${prefix}${num}`;
    },

    registerPatient(name, phone, password, physicalDetails = {}) {
        // Simple duplicate phone check
        if (this.data.patients.find(x => x.phone === phone)) {
            return { success: false, msg: 'Phone number already registered' };
        }
        const id = this.generateId('P', this.data.patients);
        const newPatient = { id, name, phone, password, ...physicalDetails, records: [], prescriptions: [] };
        this.data.patients.push(newPatient);
        this.save();
        return { success: true, id };
    },

    registerEmployee(name, role, department, password) {
        const id = this.generateId('E', this.data.employees);
        const newEmp = { id, name, role, department, password };
        this.data.employees.push(newEmp);
        this.save();
        return { success: true, id };
    },

    removeEmployee(id) {
        this.data.employees = this.data.employees.filter(e => e.id !== id);
        this.save();
        return true;
    },

    updateEmployeeDetails(id, updates) {
        const index = this.data.employees.findIndex(e => e.id === id);
        if (index !== -1) {
            this.data.employees[index] = { ...this.data.employees[index], ...updates };
            this.save();
            return true;
        }
        return false;
    },

    updateEmployee(id, name, role, department, password) {
        const index = this.data.employees.findIndex(e => e.id === id);
        if (index !== -1) {
            this.data.employees[index] = { ...this.data.employees[index], name, role, department, password };
            this.save();
            return true;
        }
        return false;
    },

    removePatient(id) {
        this.data.patients = this.data.patients.filter(p => p.id !== id);
        this.save();
        return true;
    },

    updatePatient(id, updates) {
        const index = this.data.patients.findIndex(p => p.id === id);
        if (index !== -1) {
            this.data.patients[index] = { ...this.data.patients[index], ...updates };
            this.save();
            return true;
        }
        return false;
    },

    bookAppointment(patientId, doctorId, date, time) {
        const apps = this.data.appointments.filter(a => a.doctorId === doctorId && a.date === date);
        const token = apps.length + 1;
        const newApp = { 
            id: Date.now().toString(), 
            patientId, 
            doctorId, 
            date, 
            time,
            fee: 250,
            token, 
            status: 'Booked' 
        };
        this.data.appointments.push(newApp);
        this.save();
        return { success: true, token, time };
    },

    getDoctors() {
        return this.data.employees.filter(e => e.role && e.role.toLowerCase() === 'doctor');
    },

    getPatientAppointments(patientId) {
        return this.data.appointments.filter(a => a.patientId === patientId);
    },

    getDoctorAppointments(doctorId, date) {
        return this.data.appointments.filter(a => a.doctorId === doctorId && a.date === date).sort((a,b) => a.token - b.token);
    },

    getAvailableSlots(doctorId, date) {
        const allSlots = ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM'];
        const booked = this.data.appointments.filter(a => a.doctorId === doctorId && a.date === date).map(a => a.time);
        const blocked = this.data.blockedSlots ? this.data.blockedSlots.filter(b => b.doctorId === doctorId && b.date === date).map(b => b.time) : [];
        if (blocked.includes('ALL')) return [];
        return allSlots.filter(s => !booked.includes(s) && !blocked.includes(s));
    },

    blockTimeSlot(doctorId, date, time) {
        if(!this.data.blockedSlots) this.data.blockedSlots = [];
        this.data.blockedSlots.push({ id: Date.now().toString(), doctorId, date, time });
        this.save();
        return true;
    },

    requestLabTest(patientId, doctorId, testIds, isPaid = false) {
        if(!this.data.labRequests) this.data.labRequests = [];
        const tests = Array.isArray(testIds) ? testIds.map(tid => this.catalogs.labTests.find(t => t.id === tid)).filter(Boolean) : [];
        const totalAmount = tests.reduce((sum, t) => sum + t.price, 0);
        this.data.labRequests.push({ 
            id: Date.now().toString(), patientId, doctorId, tests, totalAmount, paymentStatus: isPaid ? 'Paid' : 'Pending', details: !Array.isArray(testIds) ? testIds : '', date: new Date().toISOString().split('T')[0], status: 'Pending' 
        });
        this.save();
        return true;
    },

    getPatient(id) {
        return this.data.patients.find(p => p.id === id);
    },

    addPrescription(patientId, doctorId, medIds, notes) {
        const p = this.getPatient(patientId);
        if(p) {
            const meds = Array.isArray(medIds) ? medIds.map(mid => this.catalogs.medicines.find(m => m.id === mid)).filter(Boolean) : [];
            const totalAmount = meds.reduce((sum, m) => sum + m.price, 0);
            p.prescriptions.push({ 
                id: Date.now().toString(), doctorId, meds, totalAmount, details: notes || medIds, date: new Date().toISOString().split('T')[0], status: 'Pending' 
            });
            this.save();
            return true;
        }
        return false;
    },

    getAllPendingPrescriptions() {
        let pending = [];
        this.data.patients.forEach(p => {
            p.prescriptions.forEach(rx => {
                if (rx.status === 'Pending') {
                    pending.push({ ...rx, patientId: p.id, patientName: p.name });
                }
            });
        });
        return pending;
    },
    
    addRecord(patientId, doctorId, condition) {
        const p = this.getPatient(patientId);
        if(p) {
            p.records.push({ date: new Date().toISOString().split('T')[0], doctorId, condition });
            this.save();
            return true;
        }
        return false;
    },

    markPrescriptionBought(patientId, prescriptionId) {
        const p = this.getPatient(patientId);
        if(p) {
            const rx = p.prescriptions.find(x => x.id === prescriptionId);
            if(rx) {
                rx.status = 'Bought';
                this.save();
                return true;
            }
        }
        return false;
    },

    addLabResult(patientId, details) {
        this.data.labResults.push({
            id: Date.now().toString(),
            patientId,
            details,
            date: new Date().toISOString().split('T')[0]
        });
        this.save();
        return true;
    },

    getPendingLabRequests() {
        return this.data.labRequests ? this.data.labRequests.filter(r => r.status === 'Pending') : [];
    },

    uploadLabResult(requestId, resultsObj) {
        const req = this.data.labRequests.find(r => r.id === requestId);
        if(req) {
            req.status = 'Completed';
            // Format object into structured text for legacy display compatibility
            let detailsText = '';
            for(const [key, val] of Object.entries(resultsObj)) {
                detailsText += `<strong>${key}</strong>: ${val}<br>`;
            }
            
            this.data.labResults.push({
                id: Date.now().toString(),
                patientId: req.patientId,
                reqId: req.id,
                testName: req.tests && req.tests.length > 0 ? req.tests.map(t=>t.name).join(', ') : 'Custom Lab Test',
                details: detailsText,
                date: new Date().toISOString().split('T')[0]
            });
            this.save();
            return true;
        }
        return false;
    },

    getLabResults(patientId) {
        return this.data.labResults.filter(l => l.patientId === patientId);
    }
};

window.Store = Store;
