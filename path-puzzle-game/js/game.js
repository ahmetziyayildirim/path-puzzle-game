handleGameOver() {
    // Get message and GIF based on score
    let message, gifUrl;
    if (score <= 10) {
        message = "Potato IQ: You've achieved the intellectual capacity of a couch potato. Better luck next time!";
        gifUrl = "/assets/gifs/potato.gif";
    } else if (score <= 20) {
        message = "Stupid: Did you play this game blindfolded? Maybe give it another try with open eyes.";
        gifUrl = "/assets/gifs/stupid.gif";
    } else if (score <= 30) {
        message = "Clueless: You're not quite there yet, but hey, at least you showed up!";
        gifUrl = "/assets/gifs/clueless.gif";
    } else if (score <= 40) {
        message = "Below Average: There's potential, but it's still hiding somewhere.";
        gifUrl = "/assets/gifs/below-average.gif";
    } else if (score <= 50) {
        message = "Average Joe/Jane: You're on par with society's expectations—nothing more, nothing less.";
        gifUrl = "/assets/gifs/average.gif";
    } else if (score <= 60) {
        message = "Bright Spark: There's a flicker of brilliance. Keep it up!";
        gifUrl = "/assets/gifs/bright-spark.gif";
    } else if (score <= 70) {
        message = "Smarty Pants: You've got some moves! A little more effort, and you'll shine.";
        gifUrl = "/assets/gifs/smarty-pants.gif";
    } else if (score <= 80) {
        message = "Brainiac-in-Training: Your neurons are firing! You're almost there.";
        gifUrl = "/assets/gifs/brainiac.gif";
    } else if (score <= 90) {
        message = "Genius Material: Einstein is clapping from the beyond!";
        gifUrl = "/assets/gifs/genius.gif";
    } else if (score <= 94) {
        message = "Supreme Overlord of Intelligence: You've transcended mere mortals. The world bows to your brilliance!";
        gifUrl = "/assets/gifs/overlord.gif";
    } else if (score === 95) {
        message = "Almost Genius: You can feel the brilliance just within reach. A little more effort, and you're ready to patent something absurdly useful!";
        gifUrl = "/assets/gifs/almost-genius.gif";
    } else if (score === 96) {
        message = "Borderline Einstein: Your brain is officially in overdrive, but there's still a smidgen of room for improvement. Maybe read a quantum physics paper for fun?";
        gifUrl = "/assets/gifs/einstein.gif";
    } else if (score === 97) {
        message = "Mastermind in Progress: You've cracked the code of intelligence! People might start asking for your advice on life… and math.";
        gifUrl = "/assets/gifs/mastermind.gif";
    } else if (score === 98) {
        message = "Legendary Thinker: Your IQ is a whisper away from mythical status. Don't be surprised if you start dreaming in algorithms.";
        gifUrl = "/assets/gifs/legendary.gif";
    } else if (score === 99) {
        message = "Immortal Intellect: Your brain now functions like a supercomputer. Be careful not to outwit yourself!";
        gifUrl = "/assets/gifs/immortal.gif";
    } else {
        message = "Omniscient Overlord: Congratulations, you've ascended to a divine level of intelligence. Time to rule the universe—responsibly, of course.";
        gifUrl = "/assets/gifs/omniscient.gif";
    }
} 