WIDTH = 30.5 / 2;
DEPTH = 39;


module output()
{
    translate( v = [
        WIDTH + 2
        ,0
        ,0
    ]) rotate( a = [
        0
        ,0
        ,-180
    ]) difference() {
        union() {
            // Main mount
            cube( size = [
                WIDTH + 2
                ,DEPTH + 2
                ,6
            ]);

            // Vert mounting brackets
            translate( v = [
                -11
                ,0
                ,0
            ]) {
                cube( size = [
                    WIDTH + 11
                    ,2
                    ,8
                ]);
            }
        }

        // Cutout
        translate( v = [
            2
            ,-1
            ,2
        ]) {
            cube( size = [
                WIDTH + 1
                ,DEPTH + 1
                ,20
            ]);
        }

        // Screw holes
        rotate( a = [
            90
            ,0
            ,0
        ]) translate( v = [
            -5
            ,4
            ,-4
        ]) {
            cylinder(
                h = 10
                ,d = 4.1
                ,$fn = 32
            );
        }
    }
}


output();
mirror([ 1, 0, 0 ]) output();
