# platziverse-mqtt

Definición de los mensajes que seran enviados.

## `agent/connected`
```javascript
{
  agent: {
    uuid, // auto generar
    username, // definir por configuración
    hostname, // obtener del SO
    pid, // obtener del processo
  }
}
```

## `agent/disconnected`
```javascript
{
  agent: {
    uuid
  }
}
```

## `agent/message`
```javascript
{
  agent,
  metrics: [{
    type,
    value
  }],
  timestamp // generar cuando se crea el mensaje
}
```