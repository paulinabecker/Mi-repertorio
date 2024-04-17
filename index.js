import pg from "pg";
import express from 'express';

const { Pool } = pg;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  password: "Pauli1989+",
  database: "repertorio",
  port: 5432,
});

const app = express();
const port = 3000;

app.use(express.static("public"))
app.use(express.json());

app.get("/"), (req, res) => {
    res.sendFile(__dirname + "public/index.html");
};

// Ruta para insertar una nueva canción
app.post('/cancion', async (req, res) => {
    const { titulo, artista, tono } = req.body;

    // Validar que el campo tono no sea null o una cadena vacía
    if (!tono || tono.trim() === '') {
        return res.status(400).send('El campo tono es obligatorio');
        
    }

    try {
      const query = 'INSERT INTO canciones (titulo, artista, tono) VALUES ($1, $2, $3)';
      const values = [titulo, artista, tono];
      await pool.query(query, values);
      res.status(201).send('Canción insertada correctamente');
    } catch (error) {
      console.error('Error al insertar la canción:', error);
      res.status(500).send('Error interno del servidor');
    }
});

  
  // Ruta para obtener todas las canciones
  app.get('/canciones', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM canciones');
      res.json(result.rows);
    } catch (error) {
      console.error('Error al obtener las canciones:', error);
      res.status(500).send('Error interno del servidor');
    }
  });
  
  // Ruta para  una canción
  app.put('/cancion/:id', async (req, res) => {
    const { id } = req.params;
    const { titulo, artista, tono } = req.body;
  
    try {
      const query = 'UPDATE canciones SET titulo = $1, artista = $2, tono = $3 WHERE id = $4';
      const values = [titulo, artista, tono, id];
      await pool.query(query, values);
      res.send('Canción actualizada correctamente');
    } catch (error) {
      console.error('Error al actualizar la canción:', error);
      res.status(500).send('Error interno del servidor');
    }
});

  
  // Ruta para eliminar una canción  //EJ. CONSULTA http://localhost:3000/cancion?id=9
  app.delete('/cancion', async (req, res) => {
    const id = req.query.id; // Obtener el ID de la canción de la cadena de consulta
  
    if (!id) {
      return res.status(400).send('El ID de la canción es necesario en la consulta');
    }
  
    try {
      const query = 'DELETE FROM canciones WHERE id = $1';
      const values = [id];
      await pool.query(query, values);
      res.send('Canción eliminada correctamente');
    } catch (error) {
      console.error('Error al eliminar la canción:', error);
      res.status(500).send('Error interno del servidor');
    }
});


// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor levantado en el puerto ${port}`);
  });

