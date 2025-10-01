para que corra sin problemas typescript se instala nodemon, aparte se debe poner en el package.json:

correr back:
"dev": "nodemon ./src/app.ts",
npm run dev

correr compilador de front: 
npm run build para compilar una vez.
npm run watch para compilar automáticamente cada vez que guardes un .ts.

correr front:
npx serve -l 5173