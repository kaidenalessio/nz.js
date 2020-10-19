const MyMesh = {
	makeObstacle() {
		return Mesh.LoadFromOBJText(`
			v 0.5 2 -1
			v 0.5 52 -1
			v 0.5 2 1
			v 0.5 52 1
			v -0.5 2 -1
			v -0.5 52 -1
			v -0.5 2 1
			v -0.5 52 1
			v 0.5 -52 -1
			v 0.5 -2 -1
			v 0.5 -52 1
			v 0.5 -2 1
			v -0.5 -52 -1
			v -0.5 -2 -1
			v -0.5 -52 1
			v -0.5 -2 1
			f 2 3 1
			f 4 7 3
			f 8 5 7
			f 6 1 5
			f 7 1 3
			f 4 6 8
			f 10 11 9
			f 12 15 11
			f 16 13 15
			f 14 9 13
			f 15 9 11
			f 12 14 16
			f 2 4 3
			f 4 8 7
			f 8 6 5
			f 6 2 1
			f 7 5 1
			f 4 2 6
			f 10 12 11
			f 12 16 15
			f 16 14 13
			f 14 10 9
			f 15 13 9
			f 12 10 14
		`);
	},
	makeFishy() {
		return Mesh.LoadFromOBJText(`
			v 0.25 -0.25 0.25
			v -0 0.15 0.15
			v -0 0.05 -0.225
			v -0.129904 -0.075 0.15
			v -0.043301 -0.025 -0.225
			v 0.129904 -0.075 0.15
			v 0.043301 -0.025 -0.225
			v -0.25 -0.25 -0.75
			v -0 0.15 0.15
			v 0 0.05 0.4
			v 0.129904 -0.075 0.15
			v 0.043301 -0.025 0.4
			v -0.129904 -0.075 0.15
			v -0.043301 -0.025 0.4
			v -0.043301 -0.1 -0.475
			v -0 0.2 -0.475
			v 0.043301 -0.1 -0.475
			f 3 4 2
			f 4 7 6
			f 3 17 16
			f 6 3 2
			f 2 4 6
			f 10 11 9
			f 11 14 13
			f 12 10 14
			f 14 9 13
			f 9 11 13
			f 15 16 17
			f 5 17 7
			f 3 15 5
			f 3 5 4
			f 4 5 7
			f 3 7 17
			f 6 7 3
			f 10 12 11
			f 11 12 14
			f 14 10 9
			f 5 15 17
			f 3 16 15
		`);
	},
	makeBubble() {
		return Mesh.LoadFromOBJText(`
			v 0.000000 -1.000000 0.000000
			v -0.723600 -0.447215 -0.525720
			v 0.276385 -0.447215 -0.850640
			v 0.894425 -0.447215 0.000000
			v 0.276385 -0.447215 0.850640
			v -0.723600 -0.447215 0.525720
			v -0.276385 0.447215 -0.850640
			v 0.723600 0.447215 -0.525720
			v 0.723600 0.447215 0.525720
			v -0.276385 0.447215 0.850640
			v -0.894425 0.447215 0.000000
			v 0.000000 1.000000 0.000000
			v 0.820570 0.817907 -0.163949
			v 0.820570 0.817907 0.188846
			v 0.577777 1.003385 0.012449
			v -0.035655 -0.894534 -0.786030
			v -0.128392 -1.080013 -0.500611
			v -0.371185 -0.894534 -0.677008
			v -0.910640 -0.021671 0.701909
			v -0.967957 0.278442 0.525512
			v -0.760583 0.278442 0.810931
			v 0.774858 -0.894535 0.329540
			v 0.474747 -1.080014 0.329540
			v 0.567483 -0.894535 0.614960
			v -0.967957 0.278442 -0.500614
			v -0.910640 -0.021671 -0.677012
			v -0.760583 0.278442 -0.786034
			v 0.550841 0.278443 1.018990
			v 0.400785 -0.021670 1.128012
			v 0.215311 0.278443 1.128012
			v 0.837212 -0.355070 -0.786034
			v 1.044586 -0.355070 -0.500614
			v 0.987268 -0.054958 -0.677012
			f 3 18 2
			f 2 1 6
			f 1 3 4
			f 4 24 22
			f 1 5 6
			f 2 6 11
			f 3 2 7
			f 3 33 31
			f 5 4 9
			f 6 5 10
			f 7 25 11
			f 3 7 8
			f 4 8 9
			f 9 30 28
			f 10 20 21
			f 7 11 12
			f 8 7 12
			f 9 15 12
			f 10 9 12
			f 11 10 12
			f 14 13 15
			f 8 15 13
			f 9 13 14
			f 17 18 16
			f 1 18 17
			f 1 16 3
			f 19 21 20
			f 6 21 19
			f 6 20 11
			f 23 22 24
			f 5 23 24
			f 4 23 1
			f 26 25 27
			f 2 27 7
			f 2 25 26
			f 29 28 30
			f 5 30 10
			f 5 28 29
			f 32 31 33
			f 4 33 8
			f 4 31 32
			f 3 16 18
			f 4 5 24
			f 3 8 33
			f 7 27 25
			f 9 10 30
			f 10 11 20
			f 9 14 15
			f 8 12 15
			f 9 8 13
			f 1 2 18
			f 1 17 16
			f 6 10 21
			f 6 19 20
			f 5 1 23
			f 4 22 23
			f 2 26 27
			f 2 11 25
			f 5 29 30
			f 5 9 28
			f 4 32 33
			f 4 3 31
		`);
	},
	makeWorld() {
		return Mesh.LoadFromOBJText(`
			v 0.000000 -10.000000 0.000000
			v -7.236073 -4.472195 -5.257253
			v 2.763880 -4.472198 -8.506493
			v 8.944263 -4.472156 0.000000
			v 2.763880 -4.472198 8.506493
			v -7.236073 -4.472195 5.257253
			v -2.763880 4.472198 -8.506493
			v 7.236073 4.472195 -5.257253
			v 7.236073 4.472195 5.257253
			v -2.763880 4.472198 8.506493
			v -8.944263 4.472156 0.000000
			v 0.000000 10.000000 0.000000
			v 1.624556 -8.506544 -4.999953
			v -4.253227 -8.506542 -3.090114
			v -2.628688 -5.257377 -8.090117
			v -8.506478 -5.257359 0.000000
			v -4.253227 -8.506542 3.090114
			v 5.257298 -8.506516 0.000000
			v 6.881894 -5.257362 -4.999969
			v 1.624556 -8.506544 4.999953
			v 6.881894 -5.257362 4.999969
			v -2.628688 -5.257377 8.090117
			v -9.510578 0.000000 -3.090126
			v -9.510578 0.000000 3.090126
			v 0.000000 0.000000 -9.999999
			v -5.877856 0.000000 -8.090167
			v 9.510578 0.000000 -3.090126
			v 5.877856 0.000000 -8.090167
			v 5.877856 0.000000 8.090167
			v 9.510578 0.000000 3.090126
			v -5.877856 0.000000 8.090167
			v 0.000000 0.000000 9.999999
			v -6.881894 5.257362 -4.999969
			v 2.628688 5.257377 -8.090117
			v 8.506478 5.257359 0.000000
			v 2.628688 5.257377 8.090117
			v -6.881894 5.257362 4.999969
			v -1.624556 8.506544 -4.999953
			v -5.257298 8.506516 0.000000
			v 4.253227 8.506542 -3.090114
			v 4.253227 8.506542 3.090114
			v -1.624556 8.506544 4.999953
			f 1 14 13
			f 2 14 16
			f 1 13 18
			f 1 18 20
			f 1 20 17
			f 2 16 23
			f 3 15 25
			f 4 19 27
			f 5 21 29
			f 6 22 31
			f 2 23 26
			f 3 25 28
			f 4 27 30
			f 5 29 32
			f 6 31 24
			f 7 33 38
			f 8 34 40
			f 9 35 41
			f 10 36 42
			f 11 37 39
			f 39 42 12
			f 39 37 42
			f 37 10 42
			f 42 41 12
			f 42 36 41
			f 36 9 41
			f 41 40 12
			f 41 35 40
			f 35 8 40
			f 40 38 12
			f 40 34 38
			f 34 7 38
			f 38 39 12
			f 38 33 39
			f 33 11 39
			f 24 37 11
			f 24 31 37
			f 31 10 37
			f 32 36 10
			f 32 29 36
			f 29 9 36
			f 30 35 9
			f 30 27 35
			f 27 8 35
			f 28 34 8
			f 28 25 34
			f 25 7 34
			f 26 33 7
			f 26 23 33
			f 23 11 33
			f 31 32 10
			f 31 22 32
			f 22 5 32
			f 29 30 9
			f 29 21 30
			f 21 4 30
			f 27 28 8
			f 27 19 28
			f 19 3 28
			f 25 26 7
			f 25 15 26
			f 15 2 26
			f 23 24 11
			f 23 16 24
			f 16 6 24
			f 17 22 6
			f 17 20 22
			f 20 5 22
			f 20 21 5
			f 20 18 21
			f 18 4 21
			f 18 19 4
			f 18 13 19
			f 13 3 19
			f 16 17 6
			f 16 14 17
			f 14 1 17
			f 13 15 3
			f 13 14 15
			f 14 2 15
		`);
	}
};