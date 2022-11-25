const sleep = ms =>
{
	if (running)
		return new Promise(r => setTimeout(r, ms));
}

function isNotFoundHidden()
{
	return $('[data-i18n="NoAvailableDateFound"]')[1].parentNode.ariaHidden === 'true';
}


async function beginAlarm()
{
	var audio = new Audio('https://www.online-timer.net/audio/acoustic-arpeggio.wav');
	
	audio.loop = true;
	audio.play();
	
	while (running)
	{
		await sleep(100);
	}
	
	audio.loop = false;
}

async function waitForResponse()
{
	var start = new Date();
	var passedSec = 0;
	
	await sleep(100);
	
	while (isNotFoundHidden() && running)
	{
		passedSec = Math.round((new Date() - start) / 1000);
		
		if (passedSec > 20)
		{
			await beginAlarm();
		}
		
		await sleep(100);
	}
	
	if (!running)
		return;
	
	await sleep(100);
}

var running = false;


function stop()
{
	running = false;
}

async function start()
{
	running = true;
	
	while (running)
	{
		await sleep(5000);
		
		if (running)
		{
			$('.icon-right').click();
			await waitForResponse();
		}
		
		await sleep(5000);
		
		if (running)
		{
			$('.icon-left').click();
			await waitForResponse();
		}
	}
}