import sqlite3 from "sqlite3";
import { execute } from "./wrapper-functions.js";
import path from "node:path";

const seedPostsTable = async () => {
    const db = new sqlite3.Database(path.join("database", "database.db"));

    const sql = `
                INSERT INTO posts (name, recipient, feelings, message) VALUES
        ('Alex', 'You', '["Grateful","Hopeful"]', 'Thanks for taking a moment to slow down and read this.'),
        ('Jamie', 'Everyone', '["Lonely","Confused"]', 'Some days feel quiet in a way that’s hard to explain.'),
        ('Liam', 'Mom', '["Grateful","Loved"]', 'I don’t say it often, but I feel lucky to have you.'),
        ('Sofia', 'Dad', '["Confused","Hopeful"]', 'Still figuring things out, but I think I’m moving forward.'),
        ('Chris', 'Myself', '["Overwhelmed","Tired"]', 'Trying to keep going even when everything feels like a lot.'),
        ('Nina', 'You', '["Caring","Trusting"]', 'I hope you’re being gentle with yourself today.'),
        ('Ethan', 'Everyone', '["Hopeful","Motivated"]', 'Progress doesn’t have to be fast to be real.'),
        ('Maya', 'Best Friend', '["Happy","Grateful"]', 'Life feels lighter knowing you exist.'),
        ('Daniel', 'You', '["Frustrated","Drained"]', 'Today took more out of me than I expected.'),
        ('Ivy', 'The World', '["Inspired","Hopeful"]', 'There’s something beautiful about starting fresh.'),
        ('Noah', 'My Past Self', '["Sad","Caring"]', 'You were doing the best you could with what you knew.'),
        ('Olivia', 'You', '["Loved","Happy"]', 'This message is here just to remind you that you matter.'),
        ('Ryan', 'Everyone', '["Confused","Inspired"]', 'Not everything is clear yet, and that’s okay.'),
        ('Ava', 'Someone I Miss', '["Lonely","Sad"]', 'I still think about you more than I admit.'),
        ('Leo', 'You', '["Relieved","Calm"]', 'You made it through today — that counts.'),
        ('Hannah', 'My Brother', '["Caring","Trusting"]', 'No matter what changes, I’ve got your back.'),
        ('Mark', 'You', '["Stressed","Pressured"]', 'Deadlines don’t stop coming, but I’m still standing.'),
        ('Ella', 'Everyone', '["Happy","Inspired"]', 'Some moments don’t need a reason to be good.'),
        ('Ben', 'My Future Self', '["Hopeful","Motivated"]', 'I hope you’re proud of how far you’ve come.'),
        ('Zoe', 'You', '["Caring","Relieved"]', 'Pause for a second. You deserve that.'),
        ('Oscar', 'Late Night Thoughts', '["Empty","Tired"]', 'The quiet hours hit differently sometimes.'),
        ('Lucy', 'You', '["Hopeful","Trusting"]', 'Things can still work out, even if it’s messy.'),
        ('Sam', 'Everyone', '["Irritated","Stressed"]', 'Trying to stay patient when everything feels urgent.'),
        ('Aria', 'My Younger Self', '["Hurt","Caring"]', 'You didn’t imagine the pain, and it wasn’t your fault.'),
        ('Jack', 'You', '["Happy","Excited"]', 'Here’s a small spark of joy, just because.'),
        ('Luna', 'The Universe', '["Inspired","Hopeful"]', 'It’s strange and wonderful that we’re here at all.'),
        ('Henry', 'You', '["Motivated","Trusting"]', 'Keep going — you’re building something real.'),
        ('Mila', 'Everyone', '["Lonely","Hopeful"]', 'Even alone, I still believe connection is possible.'),
        ('Theo', 'My Thoughts', '["Confused","Overwhelmed"]', 'My mind feels loud today, but I’m listening anyway.'),
        ('Grace', 'You', '["Grateful","Caring"]', 'Thanks for existing exactly as you are.');
        `
    try {
        await execute(db, sql);
    } catch (error) {
        console.log(`Error in seeding the table: `, error);
    } finally {
        db.close();
    }

    console.log("Seed table ended")
};

const seedCommentsTable = async () => {
    const db = new sqlite3.Database(path.join("database", "database.db"));

    const sql = `INSERT INTO comments (name, message, post_id) VALUES
                    (
                    'Anonymous',
                    'I didn’t realize how much I needed to read this until I did. Thank you.',
                    38
                    ),
                    (
                    'L',
                    'This feels like something I could have written myself on a bad night.',
                    38
                    ),
                    (
                    'Quiet soul',
                    'You’re not weak for feeling this way. You’re human.',
                    37
                    ),
                    (
                    'Sam',
                    'I hope you find a little peace today, even if it’s just for a moment.',
                    37
                    ),
                    (
                    'Anonymous',
                    'It’s comforting to know someone else feels this too.',
                    36
                    ),
                    (
                    'E',
                    'I keep rereading this. It really stuck with me.',
                    36
                    ),
                    (
                    'Someone',
                    'Thank you for trusting this space with something so personal.',
                    35
                    ),
                    (
                    'M',
                    'I don’t have the right words, but I’m glad you shared this.',
                    35
                    ),
                    (
                    'Alex',
                    'This reminded me that healing isn’t linear, and that’s okay.',
                    34
                    ),
                    (
                    'Anonymous',
                    'Even if things feel heavy now, I hope lighter days come for you.',
                    33
                    );`
        
    try {
        await execute(db, sql);
        console.log("Seed table succesfully");
    } catch (error) {
        console.log("Error occurred when seeding table: ", error);
    } finally {
        db.close();
    };

    console.log("Function ended");
};

seedCommentsTable();