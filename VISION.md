# Stuffy Frights — Original Vision

> **Provenance:** This is the original design prompt, captured verbatim, that
> you wrote on **2026-06-16** before the `mansion-rewrite` planning session
> (recovered from the Claude Code session transcript on 2026-06-17).
>
> **Capture status:** The `/apo:plan` session turned the *Setting / layout* part
> of this into a detailed spec (`.apo/02_Work/mansion-rewrite/design/` +
> `research/`). The **Gameplay Loop** part below (keycodes, phone camera feeds,
> generator, notes/clues, keypad doors, puzzles, etc.) was **not** planned in
> detail — it was compressed into a one-line "future workstream" mention and
> deferred. It now lives here so it isn't lost; it still needs a real plan.

---

Great breakdown.  I have been testing in VR, and it's been great so far.  It's a lot of fun pointing the flashlight around and seeing everything at room scale.

One detractor from the experience (on all platforms) is that the house doesn't feel realistic at all, since it's just a grid of interconnected rooms, with random assets and random hiding spots.

It makes for a fun, speedrunny kind of experience, but it loses a lot of potential in immersion and the need to hide (usually you're better to run away, and move relatively quickly)

I'm at a crossroads for design direction at this point, and the dilemma is that testing my ideas will likely require layout changes and experimentation (the kind of thing that will be lost upon migration to Unity or Godot (sounds like Unity if Godot is trailing significantly in VR)

Here's a very rough thought experiment I had last night thinking of how I'd like to see this progress from a simplistic find-key-and-escape loop to a more immersive, story-driven experience (with hopefully more replayability to keep people interested - I noticed my son is excited to ask for updates, but not playing it much after a few days of playing it)

---
The Setting:

A large mansion, old-school motif, wallpapers, furniture (Downton Abbey is in my head as I type this).  Still has an attic and a basement, but a larger floorplan, and more realisitc.

Main floor:
Has a kitchen.  A front, back, and side door.  A large formal sitting room with a piano, dining room. study, billiards room, library maybe, a mud room off of the garage, the garage has lots of shelving, and a trap door to the basement wood room.  Two staircases to the upstairs.  One staircase to the basement.

Perhaps there will be a courtyard outside with a fountain, and cellar entrance to the basement that can be opened and decended into, and some bushes/hedges.  This may actually help to open the plan up a bit so there are ways to get away from the enemies and into other rooms of the house without it feeling like the current grid.

Basement:
Some roughly-finished areas, including a bar/entertaining area, and a movie room.  A bunch of storage rooms, and old bedroom that's much older in decor than upstairs bedrooms.  Bathroom.  Excercise room with sauna.  There is a room with the power breaker that you can flip on and off (power is off, so it won't turn the power on)

There is a wine cellar.  Initially, the basement seems to be a smaller footprint than upstairs, but there is a secret passage in the cellar that goes out to some beam-reinforced tunnels that have lead to some alchemist type rooms, like a secret lab.  
There are prison cells in one section.  

Upstairs:
Lots of bedrooms and baths.  Servant/butler's quarters.  Master wing, 2 bedrooms are kid's rooms - one girls room, one for a boy.  There is a secret passage through the vents between these rooms.  Each room has a large walk-in closet, and a bunch of stuffed animals in the bed or on shelves.  I envision having a large roster of animals, and the game will start for each player with the child waking up in their room, with a note on their desk or bed from the parents about having to leave them on their own for the night, and some instruction about the flashlight.  There will be 4 random stuffies/toys missing each run, and those will be the ones patrolling the house as enemies.  There will also be a large play room with toys, tables, desks, old tv.  Closets to hide in.

If we put a courtyard in, we could have a wrap-around terrace with a couple of stairways down to the courtyard, and entrances of the many rooms - again serving as a way to flee enemies who otherwise would trap you in the halls or force you into rooms that offered no escape (though some rooms will be dead ends, with only options of, say, hiding in the bathtub behind the curtain, or in the vanity cabinet door.

Attic: 
Smaller area, since the rooflines angle in on all house edges.
It's very rustic.  Dusty wood floors and beams, lots of shelves and storage items. Bookcases full of books to hide behind.  There are not as many walled-off rooms, but there is a security room with monitors showing a bunch of camera feeds.  The user can view the monitors to get an idea of where the enemies are, but the enemies can still come into the room, and do check that room while on patrol, so the user will have to quietly hide if they see them coming close while they're still out of earshot.

All of these setting ideas are only exploratory - nothing is set in stone.  I'm open to refinements, or even suggestions of which AI agents are best to chat with about these to help refine the seting in a creative way.

---

Gameplay Loop:

With the setting established, the main goal of the game is roughly the same - survive and find a way to escape the house.

However it will no longer be as simple and linear as 'find key on floor and go to door'.

The flashlight with diminishing charge will still be a key mechanic, with charging stations strewn about around the house.

Stealth/hiding will be a much larger part of the loop.  It will be necessary to win.  I would like more of a 'clock-tower' (playstation) or 'alien isolation' kind of vibe, where you need to hide and hope not to be found.  Careful gameplay, and being aware of how much sound you're making and where the best hiding spots are as you search the house for key items will keep you safe, and allow you to hide efficiently.

I'm thinking that there will be the ability to use a cell phone (the house is old, but the tech is current) to view the camera feeds, but there is a non-renewable battery drain for the phone, so you need ot be judicious.  It may be that you need to connect to the feeds manually in the attic security room before you can access the feeds.

There will also be the odd text coming in from Dad with some clues about where to find things - 'Oh, I just remembered, I think I have the keycode for the front door written down somewhere upstairs'.  Maybe one task to enable this aspect is turning on an emergency generator in the basement to power the chargers, the security room, and the wifi.  Unfortunately, lights remain out.

I envision there being hand-written or typed notes strewn about, including in the initial room, where there will be a note on the desk explaining some silly reason the parents left the kid, and some basic instructions for what to do if the happens to go out (which it has) and what to do if he needs to get out of the house (keycode for one of the 3 main doors).  The user will not have the flashlight to begin with.  It will likely be in their room, on a desk beside the note.  They have to pick it up to use it.

I think the code will be a 4-digit number, but may have to be found one at a time.  like the paper will show _ _ 4 _, or _ 2 _ _ and the player will need to collect them.

once you have the numbers, or even 3 if you want to risk guessing the code, you need to go try them on one of the 3 doors.  Like the map, you can be killed while doing this, so you need to make sure the enemy isn't too close when you try.  As well, the keypad makes beeps that can trigger the enemy to come investigate if they hear it, and if you get it wrong, there is an alarm that sounds that is loud enough that the enemies will come.  Perhaps this can be used as a strategy - lure the enemies to one door, to give you time to safely try another.

Rooms and closets will have doors.  Closets will be closed initially.  Some rooms will be open, some closed.  The user can open and close doors.  The stuffies can open them.

Desk drawers can be opened to search for clues - they may not always be in plain sight.

This is all very early thoughts - a thought experiment - I would love your feedback, as well as suggestions on which AI agents are best for ideating on gameplay.

After typing this - I think I want this to feel like a mix of stealth survival horror, hide and seek, and escape room where you figure out how to escape via following clues and solving puzzles or problems.  The escape room motifs need to have a level of randomness ot keep it from becoming stale on multiple runs - I don't want the game to take too long, and there aren't save points or saves at all.  

One puzzle idea is opening a safe with clues on the numbers, moving clock hands to match the billiard cues (which will need either a visit to the billiard room to see or the camera feed to it, since it will be random) - stuff like that.

Anyhow, can you capture these ideas in a markdown file for me, and bring suggestions of your own, as well as suggestions for which chat agents I should talk to to refine these ideas.

---

Implemenation:

This is where I wonder if this is too much to do on the current rendering framework.  I am open to a lower-fidelity three.js system to work on this, but it may not be possible.  I also need help with designing a floor plan.

I don't need it to be polished yet, so if we can get this going with rapid in-browser prototyping, or even a level editor (if perhaps you can find one already built, or build one) might suffice.

I wouldn't want to polish this up to a shippable product in Unity without even knowing if it's fun, or if the layout works, but it may be that the layout tools are so mature there that it becomes the proper place to experiment.

Advise me, and capture this in markdown so I don't lose these ideas.
