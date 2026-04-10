> [!CAUTION]
> [This repo has moved to GitLab](https://gitlab.com/robalexdev/time-at-the-tone)


This project is a client-side web application that produces a tone at the top of each minute, allowing you to manually synchronize clocks.

The accuracy of this approach depends on your reaction time. A three beep countdown can be used to anticipate the top-of-the-minute tone. I've been able to synchronize wall clocks (like the one on my oven and microwave) with an error below what I can perceive.

Keep in mind, your computer clock may not be well-synchronized with other clocks or references. You can check your synchronization with [UTC(NIST)](https://time.gov/) if you'd like a trusted reference point.

Beware that the time displayed on your device may lag behind its own system time. On my computer, the clock in the taskbar lags behind the system time by about one second. These clocks are designed to be references, not precision timers.
