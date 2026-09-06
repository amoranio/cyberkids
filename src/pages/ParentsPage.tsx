import { Link } from 'react-router-dom'
import { ChoiceButton } from '../components/ChoiceButton'
import { useProgress } from '../context/ProgressContext'
import { sfx } from '../utils/sound'
import './Learn.css'

export function ParentsPage() {
  const { soundOn } = useProgress()

  return (
    <div className="parents">
      <h1 className="parents__title">Grown-ups Guide</h1>
      <p className="parents__lead">
        CyberKids teaches ages 6–10 the habits of cyber safety through short
        lessons, games, and quizzes. Every zone is open from the start. Kids
        earn star points the first time they finish a lesson, game, or quiz —
        badges unlock at 25, 60, 100, 150, and 220 points. No accounts.
        Progress stays on this device.
      </p>

      <div className="parents__card">
        <h2>What kids learn</h2>
        <ul className="parents__list">
          <li>
            <strong>Share with Care</strong> — keep names, addresses, school,
            and phone numbers private.
          </li>
          <li>
            <strong>Secret Keys</strong> — long silly passwords; only trusted
            adults may know them.
          </li>
          <li>
            <strong>Don&apos;t Fall for Fake</strong> — spot prize tricks, weird
            links, and &quot;computer germs.&quot;
          </li>
          <li>
            <strong>Be Kind Online</strong> — words can hurt; tell a grown-up
            about mean messages.
          </li>
          <li>
            <strong>Ask for Help</strong> — brave means telling a trusted adult
            when something feels weird.
          </li>
        </ul>
      </div>

      <div className="parents__card">
        <h2>Talk about it at home</h2>
        <ul className="parents__list">
          <li>Ask: “What would you keep private?”</li>
          <li>Practice a silly passphrase together.</li>
          <li>Look at a fake “free prize” ad and spot the red flags.</li>
          <li>Agree on trusted adults your child can tell anytime.</li>
        </ul>
      </div>

      <div className="parents__actions">
        <Link to="/" onClick={() => sfx.click(soundOn)}>
          <ChoiceButton>Back to Cyber Isle</ChoiceButton>
        </Link>
      </div>
    </div>
  )
}
