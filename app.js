const formRegister  = document.getElementById("form-patient");
const list          = document.getElementById('list');
let datePatient     = { patient: '', email: '', date: '', id: '' }

formRegister.addEventListener('submit', addRegister)
formRegister.addEventListener('change', getValueInput)
list.addEventListener('click', actionRegister)

class Dates{
    constructor() {
        this.dates = []
    }
    addDate(record){
        this.dates = [ ...this.dates, record ]
        this.addRowsToHtml(record)
    }
    removeDate(id){
        this.dates = this.dates.filter(item => item.id != id)
        this.addRowsToHtml()
    }
    editDate(id){
        const index = this.dates.findIndex(item => item.id == id)
        const data = this.dates[index]
        this.fillFormFromEdit(data)
    }
    updateDate(record){
        this.dates.filter(item => {
            if (item.id == record.id) {
                item = record
            }
        })
        this.addRowsToHtml()
    }
    addRowsToHtml(){
        while(list.firstChild){
            list.innerHTML = ''
        }
        this.dates.forEach(record => {
            this.addRowToHtml(record)
        }) 
    }
    addRowToHtml(record) {
        const row = `
            <div class="item-list border rounded p-2 my-2 bg-gray-100" data-id="${record.id}">
                <div class="grid items-center gap-1 grid-cols-1">
                    <table class="border-collapse border border-slate-400 ">
                        <tbody>
                            <tr>
                                <td class="p-3 font-semibold border border-slate-300">PACIENTE</td>
                                <td class="p-3 border border-slate-300">${record.patient}</td>
                            </tr>
                            <tr>
                                <td class="p-3 font-semibold border border-slate-300">E-MAIL</td>
                                <td class="p-3 border border-slate-300">${record.email}</td>
                            </tr>
                            <tr>
                                <td class="p-3 font-semibold border border-slate-300">FECHA</td>
                                <td class="p-3 border border-slate-300">${record.date}</td>
                            </tr>
                        </tbody>
                    </table>   
                </div>
                <div class="grid items-center gap-2 grid-cols-2 mt-2">
                    <button class="bg-yellow-500 p-2 edit rounded">EDITAR</button>
                    <button class="bg-rose-500 p-2 delete rounded">ELIMINAR</button>
                </div>
            </div>
        `
        list.insertAdjacentHTML('beforeend', row)
    }
    fillFormFromEdit(data){
        document.getElementById('patient').value = data.patient;
        document.getElementById('email').value = data.email;
        document.getElementById('date').value = data.date;

        datePatient = data
    }
}

class Notification {
    constructor(message, type){
        this.message = message;
        this.type = type;
    }

    addNotificationInUI(){
        const className = this.type == 'error' ? 'text-rose' : 'text-green'
        const alert = `
            <div class="alert bg-white my-3 ${className}-600 p-2 border-[#c2a40c] rounded">
                <p class="">${this.message}</p>
            </div>
        `
        formRegister.closest('div').insertAdjacentHTML('beforeend', alert)
        setTimeout(() => {
            document.querySelector('.alert').remove()
        }, 1500);
    }
}

let dates = new Dates();

function addRegister(e) {
    e.preventDefault();
    let message = 'Agregado exitosamente' 
    let edit    = false

    if (datePatient.id == '')
        datePatient.id = Date.now()
    else{
        message = 'Actualizado exitosamente'
        edit    = true
    }

    const response = validationsInForm()
    if (response == '') {
        if (edit)
            dates.updateDate(datePatient)
        else
            dates.addDate(datePatient)

        const notification = new Notification(message, 'success')
        notification.addNotificationInUI()
        clearForm()
    }
}

function getValueInput(e) {
    datePatient[e.target.name] = e.target.value
}

function validationsInForm() {
    let message = '';

    if (Object.values(datePatient).some(item => String(item).trim() == ''))
        message = 'Campos vacíos.'

    if (message != ''){
        const notification = new Notification(message, 'error')
        notification.addNotificationInUI()
    }

    return message
}

function clearForm() {
    datePatient = { patient: '', email: '', date: '', id: '' }
    formRegister.reset()
}

function actionRegister(e) {
    const item  = e.target.closest('div.item-list');
    const id    = item.dataset.id;
    const classlist = e.target.classList;

    if (classlist.contains('delete'))
        deleteRegister(id)
    else if(classlist.contains('edit'))
        edit(id)
}

function deleteRegister(id) {
    dates.removeDate(id)

    const notification = new Notification('Eliminado exitosamente', 'success')
    notification.addNotificationInUI()
}

function edit(id) {
    dates.editDate(id)
}