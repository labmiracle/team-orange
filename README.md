
# Shoppy



## Introducción



Shoppy es una plataforma web diseñada para brindar a los usuarios una forma fácil y conveniente de explorar, comparar y comprar productos de diferentes tiendas de indumentaria. La aplicación permite a los clientes ver una lista de tiendas disponibles, explorar los productos de cada tienda, agregar productos al carrito de compras y realizar el proceso de checkout de forma segura y eficiente.



## Configuración



1. Clonar el repositorio desde GitHub: `git clone https://github.com/labmiracle/team-orange.git`

2. Instalar las dependencias y hacer el build: `cd server && npm run build`

3. Configuración del servidor:

- Crea un archivo `.env` en /server y define las siguientes variables de entorno:
	``` plaintext
	SHOPPY__MYSQLDATABASE=<nombre_de_la_base_de_datos>

	SHOPPY__MYSQLHOST=<direccion_del_host>

	SHOPPY__MYSQLPASSWORD=<contraseña_de_la_base_de_datos>

	SHOPPY__MYSQLPORT=<puerto_de_la_base_de_datos>

	SHOPPY__MYSQLUSER=<nombre_de_usuario_de_la_base_de_datos>

	SHOPPY__ACCESS_TOKEN=<token_de_acceso>

	NODEMAILER_USER=<usuario_de_nodemailer>

	NODEMAILER_PASSWORD=<contraseña_de_nodemailer>
	```
	- Para obtener las variables de entorno de nodemailer acceder a [Ethereal](https://ethereal.email/create)  y clickear en `Create Ethereal Account`

4. Ejecutar el script que se encuentra en server/database para generar la base de datos.

5. Inicia el servidor ejecutando el siguiente comando: `npm run start`.

6. Acceder a la aplicación en el navegador a través de la URL: `http://localhost:4000`.



## Documentación



[API documentada](http://localhost:4000/docs). Para acceder es necesario ejecutar en el server `npm run start`

Para obtener más detalles sobre la arquitectura, las rutas, los componentes y las funcionalidades de Shoppy, consulte la documentación del proyecto en [Documentación de Shoppy](https://drive.google.com/drive/folders/1FOT9YYYMYhZMcWeIGIk3jej3MSHsjeqZ?usp=sharing).

Para ver el seguimiento de tareas acceder a [Trello](https://trello.com/b/TZghHHX0/tareas).

## Integrantes




|                                          Photo                                           |           Name            |               Mail               |                              Github                              |
| :--------------------------------------------------------------------------------------: | :-----------------------: | :------------------------------: | :--------------------------------------------------------------: |
|   <img src="https://avatars.githubusercontent.com/u/59041211" height="50" width="50">    |      Adrián Ferrari       | sdadrian@gmail.com  |      [@AdrianFerrari](https://github.com/AdrianFerrari)      |
|   <img src="https://avatars.githubusercontent.com/u/94578945" height="50" width="50">    |       Nicolás Fontana        |      nico.fontana12@gmail.com       |          [@NicolasFontana](https://github.com/NicolasFontana)          |
|   <img src="https://avatars.githubusercontent.com/u/73891755" height="50" width="50">    |     Tomas Birbe      |  tomas.birbe@gmail.com   |     [@tomasbirbe](https://github.com/tomasbirbe)     |
|   <img src="https://avatars.githubusercontent.com/u/130410870" height="50" width="50">    |    Valeria Florensa    |   valeriaflorensa28@gmail.com    |        [@ValeFlorensa](https://github.com/ValeFlorensa)        |