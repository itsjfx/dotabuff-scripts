// ==UserScript==
// @name	dotabuff scripts
// @namespace	https://jfx.ac/
// @version	1.1
// @description	some scripts for dotabuff
// @author	jfx
// @include	/^http[s]*:\/\/[www.]*dotabuff\.com\/+(players\/)+[0-9]*/
// @grant	GM_addStyle
// @copyright	2020 jfx
// ==/UserScript==

GM_addStyle(`
	.color-helper {
		color: #5cf12c !important;
	}
`);

// playerId holds the account id of the current pages user
// accountId holds the account id of the current logged in user (you)
let playerId, accountId;

$(function() {
	console.log("dotabuff scripts run");

	// Remove the plus buttons from the bar
	$("a[href='\\#plus-feature']").each((i, element) => {
		const button = $(element);
		if (button.text() == "Played With Me") {
			button.remove();
			return;
		}
	});
	
	// Set our users account id to accountId by getting their ID from cookies
	accountId = readCookie("_player_id");
	// Find the id of the users profile we are currently on
	playerId = window.location.pathname.match(/\d+/g);
	if (playerId && playerId.length && playerId[0])
		playerId = playerId[0];
	
	// Add our custom buttons
	addButtons();
	// Add our modals to the HTML code
	INJECTED_MODALS.forEach(modal =>$(".container-outer").append(modal));
});

function addButtons() {
	// Add the played with me button
	if (!playerId)
		return;
	if (accountId != playerId) {
		const playedWithMe = `<li class=""><a id="played-with-me" class="color-helper" href="https://www.opendota.com/players/${accountId}/matches?included_account_id=${playerId}"}>Played With Me</a></li>`;
		$(".dropdown-menu").append(playedWithMe);
	}
	// Add OpenDota profile button
	$(".dropdown-menu").append(`<li class=""><a class="color-helper" id="helper-opendota-profile" href="https://www.opendota.com/players/${playerId}">OpenDota Profile</a></li>`);
}

// Unused
const INJECTED_MODALS = [
	`<div class="modal seemsgood" id="error" style="display: none">
		<section>
			<header class="premium">
				Error
			</header>
			<footer style="max-width: 600px">
				<p><em>An error occured with the last operation</em></p>
				<p style="padding: 12px 0 0 0">
					<a class="button button-muted simplemodal-close" href="">
						Close
					</a>
				</p>
			</footer>
		</section>
	</div>`
];

function addModalEventToElement(element) {
	return $(element).click(function(t) {
		return t.preventDefault(), $($(this).attr("href")).modal({
			closeHTML: '<a class="modalCloseImg" title="Close"><i class="icon-remove"></i></a>',
			minWidth: 400,
			overlayClose: !0,
			zIndex: 2e3
		});
	});
}

function readCookie(name) {
	var nameEQ = encodeURIComponent(name) + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) === ' ')
			c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) === 0)
			return decodeURIComponent(c.substring(nameEQ.length, c.length));
	}
	return null;
}