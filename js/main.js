const arr_autos = []

function Auto(codigo,marca,modelo,precio,motor){
    this.codigo = codigo;
    this.marca = marca;
    this.modelo = modelo;
    this.precio = parseFloat(precio);
    this.motor = motor;
    this.disponible = true;

    this.vendido = function (){
        this.disponible = false;
    }
}


function existe_auto(cod){
    i = 0;
    while (i < arr_autos.length && arr_autos[i].codigo != cod){
        i++;
    };
    if (i < arr_autos.length) {
        return i
    }else{
        return -1
    }
}

function set_auto(){
    codigo = prompt("Ingrese codigo: ")
    indice = existe_auto(codigo)
    if (indice != -1){
        alert("Codigo ya utilizado");
    }else{
        marca = prompt("Ingrese marca: ")
        modelo = prompt("Ingrese modelo: ")
        motor = prompt("Ingrese motor: ")
        precio = prompt("Ingrese precio: ")
        arr_autos.push(new Auto(codigo, marca, modelo, precio, motor))
    }
    
}

function get_auto(){
    cod = prompt("Ingrese codigo: ")
    indice = existe_auto(cod)
    if (indice != -1){
        alert("Marca: " + arr_autos[indice].marca + " Modelo: " + arr_autos[indice].modelo + " Motor: " + arr_autos[indice].motor + " Precio: " + arr_autos[indice].precio);
    }else{
        alert("Auto no encontrado");
    }
}

function get_autos_todos(){
    if (arr_autos.length == 0){
        alert("No se han cargado autos");
    }else{
        for (let i = 0; i < arr_autos.length ; i++){
            alert("Marca: " + arr_autos[i].marca + " Modelo: " + arr_autos[i].modelo + " Motor: " + arr_autos[i].motor + " Precio: " + arr_autos[i].precio + " Codigo: " + arr_autos[i].codigo);
        }
    }
}

function delete_auto(){
    cod = prompt("Ingrese codigo: ")
    indice = existe_auto(cod)
    if (indice != -1){
        arr_autos.splice(indice, 1);
        alert("Auto eliminado");
    }else{
        alert("Auto no encontrado");
    }
}

function menu_principal(opcion){
    switch (opcion){
        case 0:
            alert("Gracias por visitar BuyCars UY!");
            break;
        case 1:
            set_auto();
            break;
        case 2:
            get_auto();
            break;
        case 3:
            get_autos_todos()
            break;
        case 4:
            delete_auto();
            break;
        default:
            alert("Opción no válida")
            break;
    }
}

do {
    opcion = parseInt(prompt("Bienvenido a BuyCars UY, por favor seleccione una opcion: \n 1- Nuevo auto \n 2- Buscar auto \n 3- Ver autos \n 4- Borrar auto \n 0- Salir"));
    menu_principal(opcion);
} while (opcion !== 0);