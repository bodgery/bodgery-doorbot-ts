MOUNT_HEIGHT = 6;
PCB_THICKNESS = 3;


module bracket()
{
    difference() {
        translate([
            -4
            ,0
            ,0
        ]) {
            cube( size = [
                63
                ,4
                ,3
            ]);

            hook();
            translate([
                59
                ,0
                ,0
            ]) {
                hook( true );
            }
        }

        translate([
            -7
            ,-2
            ,0
        ]) rotate( a = [
            0
            ,45
            ,0
        ]) {
            cube( size = [
                4
                ,12
                ,4
            ]);
        }

        translate([
            56.2
            ,-2
            ,0
        ]) rotate( a = [
            0
            ,45
            ,0
        ]) {
            cube( size = [
                4
                ,12
                ,4
            ]);
        }
    }

    translate([
        3
        ,2
        ,0
    ]) {
        cylinder(
            h = MOUNT_HEIGHT
            ,d = 3.5
            ,$fn = 32
        );
        cylinder(
            h = 7
            ,d = 2.5
            ,$fn = 32
        );

        translate([
            49
            ,0
            ,0
        ]) {
            cylinder(
                h = MOUNT_HEIGHT
                ,d = 3.5
                ,$fn = 32
            );
            cylinder(
                h = 7
                ,d = 2.5
                ,$fn = 32
            );
        }
    }
}

module hook(
    turn = false
)
{
    trans_x = turn
        ? -2
        : 0;
    trans_cube_x = turn
        ? 1
        : 0;
    trans_hook_x = turn
        ? -2
        : 2;
    trans_hook_z = turn
        ? MOUNT_HEIGHT + PCB_THICKNESS
        : MOUNT_HEIGHT + PCB_THICKNESS + 2.3;
    trans_rot_y = turn
        ? -30
        : 30;

    difference() {
        union() {
            translate([
                trans_cube_x
                ,0
                ,0
            ]) {
                cube( size = [
                    3
                    ,4
                    ,MOUNT_HEIGHT + PCB_THICKNESS
                ]);
            }

            translate([
                trans_x
                ,0
                ,MOUNT_HEIGHT + PCB_THICKNESS
            ]) {
                cube( size = [
                    6
                    ,4
                    ,2
                ]);
            }
        }

        translate([
            trans_hook_x
            ,-2
            ,trans_hook_z
        ]) rotate( a = [
            0
            ,trans_rot_y
            ,0
        ]) {
            cube( size = [
                6
                ,12
                ,4
            ]);
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
