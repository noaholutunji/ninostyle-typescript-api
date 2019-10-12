import app from './app';

const port: string | undefined = process.env.PORT;

app.listen(port, (): void => {
  console.log(`Server is up on port ${port}`);
});
