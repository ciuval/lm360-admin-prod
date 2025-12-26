export default function Signup(){
  return (
    <section className="lm360-section narrow">
      <h2>💫 Crea il tuo profilo</h2>
      <input className="input" placeholder="Email" />
      <input className="input" placeholder="Password" type="password" />
      <button className="btn solid">Registrati</button>
      <p className="muted">Hai già un account? <a href="#/login">Accedi</a></p>
    </section>
  )
}
