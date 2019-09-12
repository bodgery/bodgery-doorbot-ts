module bracket()
{
    cube( size = [
        55
        ,4
        ,3
    ]);
    translate([
        3
        ,2
        ,0
    ]) {
        cylinder(
            h = 6
            ,d = 3.5
            ,$fn = 32
        );
        cylinder(
            h = 9
            ,d = 2.5
            ,$fn = 32
        );

        translate([
            49
            ,0
            ,0
        ]) {
            cylinder(
                h = 6
                ,d = 3.5
                ,$fn = 32
            );
            cylinder(
                h = 9
                ,d = 2.5
                ,$fn = 32
            );
        }
    }
}

module screw_mount()
{
    difference() {
        cylinder(
            h = 3
            ,d = 8
            ,$fn = 32
        );
        screw_hole();
    }
}

module screw_hole()
{
    translate([
        0
        ,0
        ,0.1
    ]) {
        cylinder(
            h = 3
            ,d1 = 0
            ,d2 = 6
            ,$fn = 32
        );
    }

    translate([
        0
        ,0
        ,-1
    ]) {
        cylinder(
            h = 5
            ,d = 4
            ,$fn = 32
        );
    }
}

module brace()
{
    difference()
    {
        cube( size = [
            4
            ,58
            ,3
        ]);
        translate([
            2
            ,15
            ,0
        ]) screw_hole();
        translate([
            2
            ,45
            ,0
        ]) screw_hole();
    }

    translate([
        2
        ,15
        ,0
    ]) screw_mount();
    translate([
        2
        ,45
        ,0
    ]) screw_mount();
}


bracket();
translate([
    0
    ,58
    ,0
]) bracket();

brace();
translate([
    51
    ,0
    ,0
]) brace();
