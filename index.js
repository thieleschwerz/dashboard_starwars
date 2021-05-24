const personagensContador = document.getElementById("personagens"); //uso const para armazenar valores que nao vao mudar (permanente)
const luasContador = document.getElementById("luas"); //document.getElementById retorna a referencia do elemento atraves de seu id
const planetasContador = document.getElementById("planetas"); //os ID's estao la no HTML
const navesContador = document.getElementById("naves");

preencherContadores(); //declaro funcao
preencherTabela();
google.charts.load("current", { packages: ["corechart"] });
google.charts.setOnLoadCallback(desenharGrafico);

async function desenharGrafico() {
  const response = await swapiGet("vehicles/");
  const vehicleArray = response.data.results;

  const dataArray = [];
  dataArray.push(["Veiculos", "Passageiros"]);
  vehicleArray.forEach((vehicle) => {
    dataArray.push([vehicle.name, Number(vehicle.passengers)]);
  });

  var data = google.visualization.arrayToDataTable(dataArray);

  var options = {
    title: "Maiores Veículo",
    legend: "none"
  };

  var chart = new google.visualization.PieChart(
    document.getElementById("piechart")
  );

  chart.draw(data, options);
}

function preencherContadores() {
  //O promise e usado para processamento assincrono. Representa um valor que pode estar disponivel agora, no futuro ou nunca
  //usamos porque tinhamos varias requisicoes acontecendo ao mesmo tempo
  // dentro do promise tenho um array
  Promise.all([
    swapiGet("people/"),
    swapiGet("vehicles/"),
    swapiGet("planets/"),
    swapiGet("starships/")
  ]).then(function (results) {
    //innet.HTML e usado para inserir ou modificar o HMTL de algum elemento
    personagensContador.innerHTML = results[0].data.count;
    luasContador.innerHTML = results[1].data.count;
    planetasContador.innerHTML = results[2].data.count;
    navesContador.innerHTML = results[3].data.count;
  });
}

//quero que ele seja uma chamada assincrona, que a API retorne os dados e depois siga

async function preencherTabela() {
  const response = await swapiGet("films/");
  const tableData = response.data.results;
  console.log(tableData);
  tableData.forEach((film) => {
    $("#filmsTable").append(`<tr>
    <td>${film.title}</td>
    <td>${moment(film.release_date).format("DD/MM/YYYY")}</td>
    <td>${film.director}</td>
    <td>${film.episode_id}</td>
    </tr>`);
  });
}

//estou chamando a API para retornar os valores
function swapiGet(param) {
  return axios.get(`https://swapi.dev/api/${param}`);
}