$(document).ready(function(){
	$('.deleteUser').on('click', deleteUser);
});
$(document).ready(function(){
	$('.editUser').on('click', editUser);
});
let idActual;

function deleteUser(){
    var confirmation = confirm('Are You Sure?');
	if(confirmation){
		$.ajax({
			type: 'DELETE',
			url:  '/users/delete/'+$(this).data('id')
		}).done(function(response){
			window.location.replace('/')
		});

	} else {
		return false;
	}

}

function editUser(){
	document.getElementById('boton_submit').value = 'Editar';
	idActual = $(this).data('id');
	fetch('/users/'+$(this).data('id'))
	.then(response => {
		return response.json();
	}).then(data =>{
		document.getElementById('first_name').value = data.first_name;
		document.getElementById('last_name').value = data.last_name;
		document.getElementById('email').value = data.email;
	}).catch(function(error){
		console.log(error);
	});
}


function boton() {
	if (document.getElementById('boton_submit').value === 'Editar') {
		let usuario = JSON.stringify({
			first_name: document.getElementById('first_name').value,
			last_name: document.getElementById('last_name').value,
			email: document.getElementById('email').value,
		});
		//console.log(usuario);
		fetch('/users/update/' + idActual, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: usuario,
		}).then(_ => {
			window.location.replace('/')
		})
	} else {
		//lo que hace por defecto (definido en el ejs)
		document.getElementById('form').submit();
	}
}
