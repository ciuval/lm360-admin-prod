export default function Login(){
  return (
    <section className="lm360-section narrow">
      <h2>🔒 Accedi</h2>
      <input className="input" placeholder="email@example.com" />
      <input className="input" placeholder="••••••••" type="password" />
      <button className="btn solid">Accedi</button>
      <p className="muted">Non hai un account? <a href="#/signup">Crea profilo</a></p>
    </section>
  )
}
