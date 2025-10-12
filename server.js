const jsonServer = require('json-server');
const auth = require('json-server-auth');
const cors = require('cors');

const app = jsonServer.create();
const router = jsonServer.router('db.json');

app.db = router.db;

app.use(cors());
app.use(jsonServer.defaults());
app.use(auth);
app.use(router);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`✅ JSON Server with Auth is running on http://localhost:${PORT}`);
});
