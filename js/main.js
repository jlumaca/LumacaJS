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


function disponible_vendido(indice){
    if (arr_autos[indice].disponible){
        estado = "\nEstado: Disponible/En stock";
    }else{
        estado = "\nEstado: Vendido";
    }
    return estado
}
function set_auto(){
    codigo = parseInt(prompt("Ingrese codigo o presione -1 para volver a menu principal: "))
    if (codigo != -1){
        indice = existe_auto(codigo)
        if (indice != -1){
            alert("Codigo ya utilizado");
            set_auto()
        }else{
            marca = prompt("Ingrese marca: ")
            modelo = prompt("Ingrese modelo: ")
            motor = prompt("Ingrese motor: ")
            precio = prompt("Ingrese precio: ")
            arr_autos.push(new Auto(codigo, marca, modelo, precio, motor))
            console.log(arr_autos)
        }
    }
    
    
}

function get_auto(){
    cod = parseInt(prompt("Ingrese codigo o presione -1 para volver a menu principal: "))
    if (cod != -1){
        indice = existe_auto(cod)
        if (indice != -1){
            alert("Marca: " + arr_autos[indice].marca + " Modelo: " + arr_autos[indice].modelo + " Motor: " + arr_autos[indice].motor + " Precio: " + arr_autos[indice].precio + disponible_vendido(indice));
            get_auto()
            console.log(arr_autos)
        }else{
            alert("Auto no encontrado");
            get_auto()
        }
    }
    
}

function get_autos_todos(){
    if (arr_autos.length == 0){
        alert("No se han cargado autos");
    }else{
        for (let i = 0; i < arr_autos.length ; i++){
            alert("Marca: " + arr_autos[i].marca + " Modelo: " + arr_autos[i].modelo + " Motor: " + arr_autos[i].motor + " Precio: " + arr_autos[i].precio + " Codigo: " + arr_autos[i].codigo + disponible_vendido(i));
        }
        console.log(arr_autos)
    }
}


function vender_auto(){
    cod = parseInt(prompt("Ingrese codigo  o presione -1 para volver a menu principal: "))
    if (cod != -1){
        indice = existe_auto(cod)
        if (indice != -1){
            if (arr_autos[i].disponible){
                arr_autos[i].vendido();
                alert("Auto vendido con éxito");
                console.log(arr_autos)
                vender_auto()
            }else{
                alert("El auto ya se encuentra vendido");
                vender_auto()
            }
        }else{
            alert("Auto no encontrado");
            vender_auto()  
        }
    }
    
}


function delete_auto(){
    cod = parseInt(prompt("Ingrese codigo o presione -1 para volver a menu principal: "))
    if (cod != -1){
        indice = existe_auto(cod)
        if (indice != -1){
            arr_autos.splice(indice, 1);
            alert("Auto eliminado");
            console.log(arr_autos)
            delete_auto()
        }else{
            alert("Auto no encontrado");
            delete_auto()
        }
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
            vender_auto()
            break;
        case 5:
            delete_auto();
            break;
        default:
            alert("Opción no válida")
            break;
    }
}

do {
    opcion = parseInt(prompt("Bienvenido a BuyCars UY, por favor seleccione una opcion: \n 1- Nuevo auto \n 2- Buscar auto \n 3- Ver autos \n 4- Vender auto \n 5- Borrar auto \n 0- Salir"));
    menu_principal(opcion);
} while (opcion !== 0);