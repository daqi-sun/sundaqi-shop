var scene;
var devices = [];
var useTime;
var question6 = [];
var recommendedResult;

var localTimer
function makeTimeout(page, timeout) {
    // clearTimeout(localTimer);
    // localTimer = setTimeout(function () {
    //   changePage(page);
    // }, timeout);
}

function cleanStatus() {
    devices.length = 0;
    useTime = 0;
    question6.length = 0;
    // console.log("clean")
    $('input[type=checkbox]:checked').prop("checked",false);
    $('input[type=radio][name!="questionAnswer1"]:checked').prop("checked", false);
    $('.next-btn').attr("disabled", true);
}

// Q1 Radio 事件
$("#questionOne-answerOne").bind("change", function () {
    if (scene != 0) {
        cleanStatus();
    }
    scene = 0;
    $("#next1").attr("disabled", false);
    makeTimeout(chooseQuestion(scene), 1000);
})

$("#questionOne-answerTwo").bind("change", function () {
    if (scene != 1) {
        cleanStatus();
    }
    scene = 1;
    $("#next1").attr("disabled", false);
    makeTimeout(chooseQuestion(scene), 1000);
})

$("#questionOne-answerThree").bind("change", function () {
    if (scene != 2) {
        cleanStatus();
    }
    scene = 2;
    $("#next1").attr("disabled", false);
    makeTimeout(chooseQuestion(scene), 1000);
})

// Q5 Radio 事件
$("#questionFive-answerOne").bind("change", function () {
    useTime = 0;
    $("#next5").attr("disabled", false);
    makeTimeout(6, 1000);
})

$("#questionFive-answerTwo").bind("change", function () {
    useTime = 1;
    $("#next5").attr("disabled", false);
    makeTimeout(6, 1000);
})

$("#questionFive-answerThree").bind("change", function () {
    useTime = 2;
    $("#next5").attr("disabled", false);
    makeTimeout(6, 1000);
})

$("#questionFive-answerFour").bind("change", function () {
    useTime = 3;
    $("#next5").attr("disabled", false);
    makeTimeout(6, 1000);
})

// 控制Next是否可以点击
$("#question2 input").bind("click", function () {
    if ($('#question2 input:checked:checked').length > 0) {
        $("#next2").attr("disabled", false);
    }
    else {
        $("#next2").attr("disabled", true);
    }
})

$("#question3 input").bind("click", function () {
    if ($('#question3 input:checked:checked').length > 0) {
        $("#next3").attr("disabled", false);
    }
    else {
        $("#next3").attr("disabled", true);
    }
})

$("#question4 input").bind("click", function () {
    if ($('#question4 input:checked:checked').length > 0) {
        $("#next4").attr("disabled", false);
    }
    else {
        $("#next4").attr("disabled", true);
    }
})

$("#question6 input").bind("click", function () {
    if ($('#question6 input:checked:checked').length > 0) {
        $("#next6").attr("disabled", false);
    }
    else {
        $("#next6").attr("disabled", true);
    }
})

// Next、Back点击事件
$("#choose-button").click(function () {
    changePage(1);
});

$("#next1").click(function () {
    changePage(chooseQuestion(scene));
});

$("#next2").click(function () {
    var index = 0;
    devices.length = 0;
    $.each($('#question2 input'), function () {
        if ($(this).is(':checked')) {
            devices.push(index);
        }
        index++;
    })
    changePage(5);
});

$("#next3").click(function () {
    var index = 0;
    devices.length = 0;
    $.each($('#question3 input'), function () {
        if ($(this).is(':checked')) {
            devices.push(index);
        }
        index++;
    })
    changePage(5);
});

$("#next4").click(function () {
    var index = 0;
    devices.length = 0;
    $.each($('#question4 input'), function () {
        if ($(this).is(':checked')) {
            devices.push(index);
        }
        index++;
    })
    changePage(5);
});

$("#next5").click(function () {
    changePage(6);
});

$("#next6").click(function () {
    var index = 0;
    question6.length = 0;
    $.each($('#question6 input'), function () {
        if ($(this).is(':checked')) {
            question6.push(index);
        }
        index++;
    })
    changePage(7);
    recommendedResult = getRecommendedMult(scene, devices, useTime);

    questionGAOperation();  //答题结果GA

    renderResult(recommendedResult);

    var name ;
    $.each($('.as-results'), function () {
        if($(this).attr("data-result") == recommendedResult)
        {
            name = $(this).find("#resultName").text();
        }
    })
    resultGAOperation(name); //推荐结果GA

});

$("#back2").click(function () {
    changePage(1);
});

$("#back3").click(function () {
    changePage(1);
});

$("#back4").click(function () {
    changePage(1);
});

$("#back5").click(function () {
    changePage(chooseQuestion(scene));
});

$("#back6").click(function () {
    changePage(5);
});

$("[id = start-over]").click(function () {
    //恢复到初始状态
    location.reload();
    $(window).scrollTop(0);
});

// 获取当前使用场景对于的页面
function chooseQuestion(scene) {
    var page = 0;
    switch (scene) {
        case 0:
            page = 2;
            break;
        case 1:
            page = 3;
            break;
        case 2:
            page = 4;
            break;
    }
    return page;
}

// 更改页面
function changePage(nextPage) {
    $("#start").hide();
    $("#question1").hide();
    $("#question2").hide();
    $("#question3").hide();
    $("#question4").hide();
    $("#question5").hide();
    $("#question6").hide();
    $("#end").hide();

    switch (nextPage) {
        case 0:
            $("#start").show();
            break;
        case 1:
            $("#question1").show();
            break;
        case 2:
            $("#question2").show();
            break;
        case 3:
            $("#question3").show();
            break;
        case 4:
            $("#question4").show();
            break;
        case 5:
            $("#question5").show();
            break;
        case 6:
            $("#question6").show();
            break;
        case 7:
            $("#end").show();
            break;
    }
    $(window).scrollTop(0);
}

function getRecommendedMult(scene, devices_arr, time) {
    var power = getMaxPower(scene, devices_arr);
    var cap = getCapacityAll(scene, devices_arr, time);
    var result = getResults(power, cap);
    return result;
}

function getPower(scene, devices) {
    var powerTableQ2 = [40, 100, 150, 400, 1800, 1500, 1000, 1500, 3000];
    var powerTableQ3 = [100, 750, 1400, 1100];
    var powerTableQ4 = [20, 100, 100, 1800];
    if (scene == 0) {
        return powerTableQ2[devices];
    } else if (scene == 1) {
        return powerTableQ3[devices];
    } else if (scene == 2) {
        return powerTableQ4[devices];
    } else {
        return 0
    }
}

function getCapacity(scene, devices, time) {
    var capacityTableQ2 = [
        [120, 480, 960, 961],
        [300, 1200, 1200, 1201],
        [450, 1800, 1800, 1801],
        [400, 1600, 3200, 3201],
        [300, 300, 600, 601],
        [3000, 3000, 6000, 6001],
        [167, 334, 668, 669],
        [4500, 18000, 36000, 36001],
        [9000, 36000, 72000, 72001]
    ];

    var capacityTableQ3 = [
        [300, 1200, 2400, 2401],
        [250, 2500, 5000, 5001],
        [500, 5000, 10000, 10001],
        [360, 3600, 7200, 7201]
    ];

    var capacityTableQ4 = [
        [60, 240, 480, 481],
        [300, 1200, 1200, 1201],
        [100, 400, 800, 801],
        [300, 300, 600, 601]
    ];

    if (scene == 0) {
        return capacityTableQ2[devices][time];
    } else if (scene == 1) {
        return capacityTableQ3[devices][time];
    } else if (scene == 2) {
        return capacityTableQ4[devices][time];
    } else {
        return 0
    }
}

function getMaxPower(scene, arr) {
    var maxPower = -1;
    var power = 0;
    var arrIndex = (typeof arr != "object") ? [arr] : arr
    for (var i = 0; i < arrIndex.length; i++) {
        power = getPower(scene, arrIndex[i]);
        if (power > maxPower) {
            maxPower = power;
        }
    }
    return maxPower;
}

function getCapacityAll(scene, arr, time) {
    var sumCapcity = 0;
    var arrIndex = (typeof arr != "object") ? [arr] : arr
    for (var i = 0; i < arrIndex.length; i++) {
        sumCapcity += getCapacity(scene, arrIndex[i], time);
    }
    return sumCapcity;
}

function getResults(power, capacity) {
    var result = 0;
    switch (true) {
        case (power > 0 && power <= 600):
            switch (true) {
                case (capacity > 0 && capacity <= 600):
                    result = 1;
                    break;
                case (capacity > 600 && capacity <= 1300):
                    result = 2;
                    break;
                case (capacity > 1300 && capacity <= 4000):
                    result = 3;
                    break;
                case (capacity > 4000):
                    result = 4;
                    break;
            }
            break;
        case (power > 600 && power <= 1400):
            switch (true) {
                case (capacity > 0 && capacity <= 600):
                    result = 5;
                    break;
                case (capacity > 600 && capacity <= 1300):
                    result = 6;
                    break;
                case (capacity > 1300 && capacity <= 4000):
                    result = 7;
                    break;
                case (capacity > 4000):
                    result = 8;
                    break;
            }
            break;
        case (power > 1400 && power <= 2400):
            switch (true) {
                case (capacity > 0 && capacity <= 1300):
                    result = 9;
                    break;
                case (capacity > 1300 && capacity <= 4000):
                    result = 10;
                    break;
                case (capacity > 4000):
                    result = 11;
                    break;
            }
            break;
        case (power > 2400):
            if (capacity > 0 && capacity <= 4000) {
                result = 12;
            } else if (capacity > 4000) {
                result = 13;
            }
            break;
    }
    return result;
}

//获取结果页对应产品
function renderResult(result) {
    // console.log(result)
    let resultLsts = document.querySelectorAll('.as-results')
    for (let i = 0; i < resultLsts.length; i++) {
        if (resultLsts[i].dataset.result == result) {
            resultLsts[i].classList.remove('d-none')
        }
    }

}


var question_title = [
    'Where do you require extra power?',
    'What devices do you want to power?',
    'How long do you plan to power your products?',
    'what’s most important to you?'
];


var question_lab1 = ['Home', 'Work', 'Outdoors'];
var question_lab2 = [
    ['Lights', 'Consumer electronics', 'Television', 'Refrigerator', 'Hair dryer', 'Dishwasher', 'Microwave', 'Space heater', 'Air conditioner'],
    ['Lights', 'Drill', 'Circular saw', 'Band saw'],
    ['Lights', 'Consumer electronics', 'Mini freezer', 'Hair dryer']
];
var question_lab3 = ['Few hours', 'Half a day', 'One day', 'More than one day'];
var question_lab4 = ['Portability', 'Runtime', 'Power', 'Battery life'];

function questionGAOperation() {
    sendGA('Quiz - Question options', question_title[0], question_lab1[scene]);

    for (let i = 0; i < devices.length; i++) {
        var index = devices[i];
        sendGA('Quiz - Question options', question_title[1], question_lab2[scene][index]);
    }

    sendGA('Quiz - Question options', question_title[2], question_lab3[useTime]);

    for (let i = 0; i < question6.length; i++) {
        var index = question6[i];
        sendGA('Quiz - Question options', question_title[3], question_lab4[index]);
    }
}

function resultGAOperation(result) {
    window.ga && ga('send', 'event', {
        eventCategory: 'Quiz - Products Results',
        evenAction: result
    })
    console.log(result)
}

function sendGA(category, action, label) {
    console.log(category + " " + action + "" + label);
    window.ga && ga('send', 'event', {
        eventCategory: category,
        evenAction: action,
        evenLabel: label
    })
}