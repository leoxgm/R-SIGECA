function obtenerProximosTrimestres(numAnios) {
    const actual_year = new Date().getFullYear();
    const following_years = [];

    for (let i = 0; i <= numAnios; i++) {
        let year = actual_year + i;
        for (let j = 0; j < 3; j++) {
            var year_str = String(year).slice(-2);
            switch (j) {
                case 0:
                    var trimestre = year_str + '-I';
                    break;
                case 1:
                    var trimestre = year_str + '-P';
                    break;
                case 2:
                    var trimestre = year_str + '-O';
            }
            following_years.push(trimestre);
        }
    }
    return following_years
}

module.exports = {obtenerProximosTrimestres};