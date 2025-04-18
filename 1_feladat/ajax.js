code="NCCDTYbk77bn";
last_data	= {};
if (window.location.protocol === "https:") {
	url="https://gamf-web1.asdika.dev/ajaxApi.php";
} else {
	url="http://gamf.nhely.hu/ajax2/";
}
async function crud_read()
{
	let formData = new FormData();
	formData.append("op", "read");
	formData.append("code", code);
	
	fetch(url, {
		method: "POST",
		body: formData
	})
	.then(response => response.json())
	.then(function(data){
		last_data	= data;
		draw_table(data);
	});
}
async function crud_create(name, height, weight)
{
	let formData = new FormData();
	formData.append("op", "create");
	formData.append("code", code);
	formData.append("name", name);
	formData.append("height", height);
	formData.append("weight", weight);
	
	fetch(url, {
		method: "POST",
		body: formData
	})
	.then(response => response.json())
	.then(function(v){
		if(v == "1") {
			successMessage("A sor sikeresen létrehozva.");
		}
		crud_read();
	});
	
	return false;
}

async function crud_update(id, name, height, weight)
{
	let formData = new FormData();
	formData.append("op", "update");
	formData.append("code", code);
	formData.append("id", id);
	formData.append("name", name);
	formData.append("height", height);
	formData.append("weight", weight);
	
	affected_rows	= 0;
	
	fetch(url, {
		method: "POST",
		body: formData
	})
	.then(response => response.text())
	.then(function(v){
		if(v == "1") {
			successMessage("A sor sikeresen szerkesztve.");
		}
		crud_read();
	});
	
	return affected_rows;
}

async function crud_delete(id)
{
	let formData = new FormData();
	formData.append("op", "delete");
	formData.append("code", code);
	formData.append("id", id);
	
	fetch(url, {
		method: "POST",
		body: formData
	})
	.then(response => response.json())
	.then(function(v){
		if(v == "1") {
			successMessage("A sor sikeresen törölve.");
		}
		crud_read();
	});
	
	return false;
}

function escapeHtml(text) {
	return text
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}		
function draw_table(data)
{
	let filter		= document.getElementById("crud_filter").value.toLowerCase();

	let orderField	= document.getElementById("crud_order_field").value;
	let order		= document.getElementById("crud_order").value;

	if(orderField == "name") {
		data.list.sort((a, b) => a[orderField].localeCompare(b[orderField]) * (order == "asc" ? -1 : 1));
	} else {
		data.list.sort((a, b) => (Number(a[orderField]) - Number(b[orderField])) * (order == "asc" ? -1 : 1));
	}

	height_max		= 0;
	height_sum		= 0;

	str	= "<table>";
	str	+= "<thead><tr><th>#</th><th>Név</th><th>Magasság</th><th>Tömeg</th><th></th></tr></thead>";
	for(i = 0; i < data.list.length; i++) {
		if(!data.list[i].name.toLowerCase().includes(filter) && !data.list[i].height.toLowerCase().includes(filter) && !data.list[i].weight.toLowerCase().includes(filter)) {
			continue;
		}
		str	+= "<tr id=\"list_item_" + data.list[i].id + "\">";
		str	+= "<td>#" + data.list[i].id + "</td>";
		str	+= "<td class=\"col_name\">" + escapeHtml(data.list[i].name) + "</td>";
		str	+= "<td class=\"col_height\">" + escapeHtml(data.list[i].height) + "</td>";
		str	+= "<td class=\"col_weight\">" + escapeHtml(data.list[i].weight) + "</td>";
		str	+= "<td><a class=\"list_item_delete\" data-id=\"" + data.list[i].id + "\" href=\"#\">Törlés</a> | <a class=\"list_item_edit\" data-id=\"" + data.list[i].id + "\" href=\"#\">Szerkeszt</a></td>";
		str	+= "</tr>";
		height_max	= Math.max(height_max, data.list[i].height);
		height_sum	+= Number(data.list[i].height);
	}
	str += "</table>";
	
	str	+= "Összeg: " + height_sum + ", Átlag: " + (Math.round(height_sum / data.list.length * 10) / 10) + ", Legnagyobb: " + height_max;
	
	document.getElementById("crud_list").innerHTML	= str;
	
	elements	= document.getElementsByClassName("list_item_delete");
	for (var i = 0; i < elements.length; i++) {
		elements[i].addEventListener("click", function(e){
			e.preventDefault();
			crud_delete(this.getAttribute("data-id"));
		});
	}	
	
	elements	= document.getElementsByClassName("list_item_edit");
	for (var i = 0; i < elements.length; i++) {
		elements[i].addEventListener("click", function(e){
			e.preventDefault();
			id	= this.getAttribute("data-id");
			
			document.getElementById("edit_form_inputs").classList.remove("d-none");
			
			document.getElementById("input_id_update").value = id;
			document.getElementById("input_name_update").value = document.getElementById("list_item_" + id).getElementsByClassName("col_name")[0].innerText;
			document.getElementById("input_height_update").value = document.getElementById("list_item_" + id).getElementsByClassName("col_height")[0].innerText;
			document.getElementById("input_weight_update").value = document.getElementById("list_item_" + id).getElementsByClassName("col_weight")[0].innerText;
		});
	}	
}

function getDataForId(id) {
	found = false;
	for(i = 0; i < last_data.list.length; i++) {
		console.log(last_data.list[i].id == id, last_data.list[i].id, id);
		if(last_data.list[i].id == id) {
			found = i;
			break;
		}
	}
	
	if(found === false) {
		return false;
	}
	
	return last_data.list[found];
}

function successMessage(msg)
{
	//success_msg
	document.getElementById("success_msg").innerText	= msg;
	setTimeout(function(){
		document.getElementById("success_msg").innerText	= "";
	}, 3000);
}

document.getElementById("create_form").addEventListener("submit", function(e) {
	e.preventDefault();
	let name	= document.getElementById("input_name").value;
	let height	= document.getElementById("input_height").value;
	let weight	= document.getElementById("input_weight").value;
	
	if(!name.length || name.length > 30 || !height.length || height.length > 30 || !weight.length || weight.length > 30) {
		return false;
	}
	
	crud_create(name, height, weight);
	this.reset();
	
});

document.getElementById("edit_form").addEventListener("submit", function(e) {
	e.preventDefault();
	let id		= document.getElementById("input_id_update").value;
	let name	= document.getElementById("input_name_update").value;
	let height	= document.getElementById("input_height_update").value;
	let weight	= document.getElementById("input_weight_update").value;
	
	if(!name.length || name.length > 30 || !height.length || height.length > 30 || !weight.length || weight.length > 30) {
		return false;
	}
	
	document.getElementById("edit_form_inputs").classList.add("d-none");
	document.getElementById("input_id_update").value	= "";
	
	crud_update(id, name, height, weight);

});

document.getElementById("btn_edit_back").addEventListener("click", function(e) {
	document.getElementById("edit_form_inputs").classList.add("d-none");
});

document.getElementById("btn_edit_load").addEventListener("click", function(e) {
	if(data = getDataForId(document.getElementById("input_id_update").value)) {
		document.getElementById("edit_form_inputs").classList.remove("d-none");
		document.getElementById("input_name_update").value = data.name;
		document.getElementById("input_height_update").value = data.height;
		document.getElementById("input_weight_update").value = data.weight;

	}
});

document.getElementById("crud_filter").addEventListener("keyup", function(e) {
	draw_table(last_data);
});

document.getElementById("crud_order_field").addEventListener("change", function(e) {
	draw_table(last_data);
});

document.getElementById("crud_order").addEventListener("change", function(e) {
	draw_table(last_data);
});

window.onload = function() {
	crud_read();
};
