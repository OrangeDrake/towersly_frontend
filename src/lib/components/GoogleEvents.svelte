<script>

    /* exported gapiLoaded */
    /* exported gisLoaded */
    /* exported handleAuthClick */
    /* exported handleSignoutClick */

    import {tokenClient, gisInited, gapiInited, isSingoutButtonVisible, isAuthorizeButtonVisible} from "$lib/stores/googleEventStrore.js";

    // TODO(developer): Set to client ID and API key from the Developer Console
    const CLIENT_ID = '994620839209-q02km2f69vuc8dj9ojen2gmji6qut534.apps.googleusercontent.com';
    const API_KEY = 'AIzaSyCSWEXHhRrLOyFS4VcuOqYMX8NpIrqbFb0';

    // Discovery doc URL for APIs used by the quickstart
    const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';

    // Authorization scopes required by the API; multiple scopes can be
    // included, separated by spaces.
    const SCOPES = 'https://www.googleapis.com/auth/calendar';

    const setButtonsAfterSignOn = () => {
        $isSingoutButtonVisible = true;
        $isAuthorizeButtonVisible = false;
    }

    /**
     * Callback after api.js is loaded.
     */
    export function gapiLoaded() {
        gapi.load('client', initializeGapiClient);
    }

    /**
     * Callback after the API client is loaded. Loads the
     * discovery doc to initialize the API.
     */
    async function initializeGapiClient() {
        await gapi.client.init({
            apiKey: API_KEY,
            discoveryDocs: [DISCOVERY_DOC],
        });
        $gapiInited = true;
        maybeEnableButtons();
    }

    /**
     * Callback after Google Identity Services are loaded.
     */
    export function gisLoaded() {
        $tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: CLIENT_ID,
            scope: SCOPES,
            // callback: (tokenResponse) => setButtonsAfterSignOn(), // defined later
            // callback: (tokenResponse) => {
            //     console.log("tokenResponse")
            // }
        });
        $gisInited = true;
        maybeEnableButtons();
    }

    /**
     * Enables user interaction after all libraries are loaded.
     */
    function maybeEnableButtons() {
        if ($gapiInited && $gisInited) {
            $isAuthorizeButtonVisible = true;
        }
    }

    /**
     *  Sign in the user upon button click.
     */
    export function handleAuthClick() {
        $tokenClient.callback = async (resp) => {
            setButtonsAfterSignOn();
            if (resp.error !== undefined) {
                throw (resp);
            }
            //document.getElementById('authorize_button').innerText = 'Refresh';
            await listUpcomingEvents();
        };

        if (gapi.client.getToken() === null) {
            // Prompt the user to select a Google Account and ask for consent to share their data
            // when establishing a new session.
            console.log("auth if");
            $tokenClient.requestAccessToken({prompt: 'consent'});
        } else {
            // Skip display of account chooser and consent dialog for an existing session.
            console.log("auth else");
            //tokenClient.requestAccessToken({prompt: ''});
        }
        //isSingoutButtonVisible = true;
        //isAuthorizeButtonVisible = false;
    }

    /**
     *  Sign out the user upon button click.
     */
    export function handleSignoutClick() {
        const token = gapi.client.getToken();
        if (token !== null) {
            google.accounts.oauth2.revoke(token.access_token);
            gapi.client.setToken('');
            // document.getElementById('content').innerText = '';
            // document.getElementById('authorize_button').innerText = 'Authorize';
            //document.getElementById('signout_button').style.visibility = 'hidden';
            isSingoutButtonVisible = false;
        }
        $isSingoutButtonVisible = false;
        $isAuthorizeButtonVisible = true;
    }

    /**
     * Print the summary and start datetime/date of the next ten events in
     * the authorized user's calendar. If no events are found an
     * appropriate message is printed.
     */
    async function listUpcomingEvents() {
        let response;
        try {
            const request = {
                'calendarId': 'primary',
                'timeMin': (new Date()).toISOString(),
                'showDeleted': false,
                'singleEvents': true,
                'maxResults': 10,
                'orderBy': 'startTime',
            };
            response = await gapi.client.calendar.events.list(request);
        } catch (err) {
            console.log(err);
            return;
        }

        const events = response.result.items;
        if (!events || events.length === 0) {
            console.log('No events found.');
            return;
        }
        // Flatten to string to display
        const output = events.reduce(
            (str, event) => `${str}${event.summary} (${event.start.dateTime || event.start.date})\n`,
            'Events:\n');
        console.log(output);
    }

</script>


<!--<button-->
<!--        type="button"-->
<!--        class="btn btn-sm m-2 variant-filled bg-amber-800"-->
<!--        on:click={() => {-->
<!--        getGoogleEvents();-->
<!--      }}-->
<!--&gt;-->
<!--    Get google calnedar events-->
<!--</button-->
<!--&gt;-->

{#if $isAuthorizeButtonVisible}
    <button type="button" id="authorize_button" class="btn btn-sm m-2 variant-filled rounded" on:click={() => handleAuthClick()}>Authorize</button>
{/if}
{#if $isSingoutButtonVisible}
    <button type="button" id="signout_button" class="btn btn-sm m-2 variant-filled rounded" on:click={() => handleSignoutClick()}>Sign Out</button>
{/if}