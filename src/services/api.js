const SHEETS_URL = "https://script.google.com/macros/s/AKfycbzZ6BsrhgLa1f6nAWTWlWCS5j_cq0xhos5pjHhSgRLUVxJPYIqoeoL-Gy6mCukzCxgz/exec";

export async function getProdutos() {
  const res = await fetch(SHEETS_URL);
  return await res.json();
}
