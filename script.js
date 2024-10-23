let player = document.getElementById('player');
let ball = document.getElementById('ball');
let isDragging = false;

ball.onmousedown = (event) => {
    isDragging = true;
    const shiftX = event.clientX - ball.getBoundingClientRect().left;
    const shiftY = event.clientY - ball.getBoundingClientRect().top;

    function moveAt(pageX, pageY) {
        ball.style.left = pageX - shiftX + 'px';
        ball.style.top = pageY - shiftY + 'px';
    }

    function onMouseMove(event) {
        if (isDragging) {
            moveAt(event.pageX, event.pageY);
        }
    }

    document.addEventListener('mousemove', onMouseMove);

    ball.onmouseup = () => {
        isDragging = false;
        document.removeEventListener('mousemove', onMouseMove);
        ball.onmouseup = null;

        evaluateThrow();
    };
};

ball.ondragstart = () => false; // ドラッグのデフォルト動作を無効に

function evaluateThrow() {
    const randomValue = Math.random(); // 0-1のランダム値を取得
    let throwResult;

    if (randomValue < 0.1) {
        throwResult = 'エクスレント！';
    } else if (randomValue < 0.3) {
        throwResult = 'グレート！';
    } else if (randomValue < 0.6) {
        throwResult = 'ナイス！';
    } else {
        throwResult = '失敗！';
    }

    showCatchScreen(throwResult); // 結果をゲット画面に表示
}

function showCatchScreen(result) {
    const catchScreen = document.getElementById('catch-screen');
    const catchMessage = document.getElementById('catch-message');

    catchMessage.textContent = result; // スロー評価の結果を表示
    catchScreen.style.display = 'flex';
}

function initMap() {
    startPlayerMovement();
    spawnPokemons();
}

function spawnPokemons() {
    setInterval(() => {
        if (player.style.display !== 'none') {
            const currentLocation = getCurrentLocation();
            const nearbyPokemons = getNearbyPokemons(currentLocation);

            if (nearbyPokemons.length > 0) {
                nearbyPokemons.forEach(pokemon => {
                    const randomChance = Math.random() * 100;
                    if (isWithinRadius(currentLocation, pokemon) && randomChance < 80) {
                        displayPokemon(pokemon);
                    } else if (isBetweenRadius(currentLocation, pokemon) && randomChance < 40) {
                        displayPokemon(pokemon);
                    }
                });
            }
        }
    }, 1000); // 1秒ごとにチェック
}

function getCurrentLocation() {
    const playerX = parseFloat(player.style.left);
    const playerY = parseFloat(player.style.top);
    return { x: playerX, y: playerY };
}

function getNearbyPokemons(location) {
    return ['pokemon1', 'pokemon2', 'pokemon3']; // サンプルデータ
}

function isWithinRadius(currentLocation, pokemon) {
    const pokemonPosition = getPokemonPosition(pokemon);
    return calculateDistance(currentLocation, pokemonPosition) <= 40;
}

function isBetweenRadius(currentLocation, pokemon) {
    const pokemonPosition = getPokemonPosition(pokemon);
    return calculateDistance(currentLocation, pokemonPosition) > 40 && calculateDistance(currentLocation, pokemonPosition) <= 80;
}

function getPokemonPosition(pokemon) {
    return { x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight };
}

function calculateDistance(loc1, loc2) {
    return Math.sqrt(Math.pow(loc2.x - loc1.x, 2) + Math.pow(loc2.y - loc1.y, 2));
}

function displayPokemon(pokemon) {
    const container = document.getElementById('pokemon-container');
    const button = document.createElement('button'); // ボタン要素を作成

    button.innerHTML = `<img src="img/mob/${pokemon}.gif" class="pokemon" alt="${pokemon}">`; // ポケモン画像をボタン内に設定
    button.className = 'pokemon-button';
    button.style.position = 'absolute'; // 位置を調整
    button.style.left = `${Math.random() * (window.innerWidth - 50)}px`;
    button.style.top = `${Math.random() * (window.innerHeight - 50)}px`;

    // クリック時にゲット画面を表示
    button.onclick = () => showCatchScreen(pokemon);

    container.appendChild(button);
}

function startPlayerMovement() {
    navigator.geolocation.watchPosition((position) => {
        const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
        };

        const x = userLocation.lng * 10; // 適宜スケーリング
        const y = userLocation.lat * 10;  // 適宜スケーリング

        player.style.left = `${x}px`;
        player.style.top = `${y}px`;
        player.style.display = 'block'; // 初回表示
    }, (error) => {
        console.error("位置情報の取得に失敗しました:", error);
    });
}

window.onload = initMap; // ページが読み込まれたときに地図を初期化
