# Desafio de backend Roshka

Contiene el contenedor de nodeJS/express y de mongodb

## Run

```
docker-compose up
```

Va a inicializar y correr los dos contenedores de MongoDB y nodeJS

**El contenedor de NodeJS** se encuentra conectado **al de MongoDB**.

## Coleccion Postman

**La coleccion de postman se encuentra dentro de la carpeta se llama coleccion collection postman el archivo Roshka Backend.postman_collection.postman_collection.json**

**La app va a correr en el http://localhost:9090**

## OBSERVACION

**Genera un archivo llamado access.log donde guarda un log de todos los llamados a la api**

**Tiene tambien incluido la sesion que se persiste en la base de datos**

**para realizar las comparaciones de contraseña y el hash tuve que usar bcryptjs debido que al realizar el comando de docker-compose la libreria de bcrypt me dio problemas**
