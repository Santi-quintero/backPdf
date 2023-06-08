// // ignore_for_file: unused_local_variable, depend_on_referenced_packages, avoid_print, library_private_types_in_public_api

// import 'dart:async';
// import 'dart:convert';
// import 'dart:math';
// import 'dart:ui';

// import 'package:auth_firebase/widgets/web.dart';
// import 'package:file_picker/file_picker.dart';
// import 'package:flutter/material.dart';
// import 'package:flutter/services.dart';
// import 'package:mime/mime.dart';
// import 'package:pdf_render/pdf_render_widgets.dart';
// import 'package:syncfusion_flutter_signaturepad/signaturepad.dart';
// import '../widgets/widgets.dart';
// import 'package:http/http.dart' as http;

// class SignaturePdf extends StatefulWidget {
//   const SignaturePdf({super.key});

//   @override
//   _SignaturePdfState createState() => _SignaturePdfState();
// }

// class _SignaturePdfState extends State<SignaturePdf> {
//   String uri = '';
//   PdfViewerController? controller;

//   String? selectedDocumentType = 'DNI';
//   final formKey = GlobalKey<FormState>();

//   List<String> documentTypes = ['DNI', 'Pasaporte', 'Carnet de conducir'];

//   Offset? startPoint;
//   Offset? endPoint;
//   bool isDrawing = false;
//   Line? currentLine;
//   final keySignaturePad = GlobalKey<SfSignaturePadState>();
//   TextEditingController nombreController = TextEditingController();
//   TextEditingController correoController = TextEditingController();
//   TextEditingController telefonoController = TextEditingController();
//   TextEditingController numeroDocumentController = TextEditingController();

//   String dropdownValue = 'CC';
//   final List<String> _genders = [
//     'CC',
//     'DNI',
//     'Pasaporte',
//     'TI',
//   ];

//   String? pdfBase64String;
//   double alto = 700;
//   double ancho = 900;

//   List<Rectangle> rectangles = [];
//   Rectangle? currentRectangle;
//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       appBar: AppBar(
//         title: const Text('Signature'),
//       ),
//       drawer: const SideMenu(),
//       body: GestureDetector(
//         onPanStart: (details) {
//           final position = details.localPosition;
//           setState(() {
//             currentRectangle = Rectangle(0, 0, position);
//           });
//         },
//         onPanUpdate: (details) {
//           final position = details.localPosition;
//           final width = position.dx - currentRectangle!.position.dx;
//           final height = position.dy - currentRectangle!.position.dy;
//           setState(() {
//             currentRectangle =
//                 Rectangle(width, height, currentRectangle!.position);
//           });
//         },
//         onPanEnd: (details) {
//           setState(() {
//             rectangles.add(currentRectangle!);
//             currentRectangle = null;
//           });
//         },
//         child: Container(
//           width: 900,
//           height: 700,
//           color: Colors.grey[200],
//           child: Stack(
//             children: [
//               for (var rectangle in rectangles)
//                 Positioned(
//                   left: rectangle.position.dx,
//                   top: rectangle.position.dy,
//                   child: Stack(
//                     children: [
//                       Container(
//                         width: rectangle.width,
//                         height: rectangle.height,
//                         color: Colors.blue,
//                       ),
//                       Positioned(
//                         top: 4,
//                         right: 4,
//                         child: MouseRegion(
//                           cursor: SystemMouseCursors.click,
//                           child: GestureDetector(
//                             onTap: () {
//                               setState(() {
//                                 rectangles.remove(rectangle);
//                               });
//                             },
//                             child: Container(
//                               padding: const EdgeInsets.all(4),
//                               color: Colors.red,
//                               child: const Icon(
//                                 Icons.close,
//                                 color: Colors.white,
//                                 size: 18,
//                               ),
//                             ),
//                           ),
//                         ),
//                       ),
//                     ],
//                   ),
//                 ),
//               if (currentRectangle != null)
//                 Positioned(
//                   left: currentRectangle!.position.dx,
//                   top: currentRectangle!.position.dy,
//                   child: Container(
//                     width: currentRectangle!.width,
//                     height: currentRectangle!.height,
//                     color: Colors.blue.withOpacity(0.3),
//                   ),
//                 ),
//             ],
//           ),
//         ),
//       ),
//     );
//   }

//   Form formSignature() {
//     return Form(
//       key: formKey,
//       child: Column(
//         crossAxisAlignment: CrossAxisAlignment.start,
//         children: <Widget>[
//           TextFormField(
//             controller: nombreController,
//             decoration: const InputDecoration(
//               labelText: 'Nombre completo',
//             ),
//             validator: (value) {
//               if (value!.isEmpty) {
//                 return 'Por favor, ingresa tu nombre completo';
//               }
//               return null;
//             },
//           ),
//           const SizedBox(height: 16.0),
//           TextFormField(
//             controller: correoController,
//             decoration: const InputDecoration(
//               labelText: 'Correo electrónico',
//             ),
//             validator: (value) {
//               if (value!.isEmpty) {
//                 return 'Por favor, ingresa tu correo electrónico';
//               }
//               return null;
//             },
//           ),
//           const SizedBox(height: 16.0),
//           TextFormField(
//             controller: telefonoController,
//             decoration: const InputDecoration(
//               labelText: 'Teléfono o celular',
//             ),
//             validator: (value) {
//               if (value!.isEmpty) {
//                 return 'Por favor, ingresa tu teléfono o celular';
//               }
//               return null;
//             },
//           ),
//           const SizedBox(height: 16.0),
//           DropdownButtonFormField<String>(
//             decoration: const InputDecoration(
//               labelText: 'Tipo de documento',
//             ),
//             value: dropdownValue,
//             onChanged: (String? newValue) {
//               setState(() {
//                 dropdownValue = newValue!;
//               });
//             },
//             items: _genders.map<DropdownMenuItem<String>>((String gender) {
//               return DropdownMenuItem<String>(
//                 value: gender,
//                 child: Text(gender),
//               );
//             }).toList(),
//             validator: (value) {
//               if (value == null) {
//                 return 'Por favor, selecciona un tipo de documento';
//               }
//               return null;
//             },
//           ),
//           const SizedBox(height: 16.0),
//           TextFormField(
//             controller: numeroDocumentController,
//             onChanged: (String value) {
//               setState(() {});
//             },
//             decoration: const InputDecoration(
//               labelText: 'Número de documento',
//             ),
//             validator: (value) {
//               if (value!.isEmpty) {
//                 return 'Por favor, ingresa tu número de documento';
//               }
//               return null;
//             },
//           ),
//           const SizedBox(height: 16.0),
//           SfSignaturePad(
//             key: keySignaturePad,
//             backgroundColor: Colors.red[300],
//           ),
//           const SizedBox(height: 16.0),
//           Center(
//             child: MaterialButton(
//               shape: RoundedRectangleBorder(
//                   borderRadius: BorderRadius.circular(10)),
//               disabledColor: Colors.grey,
//               elevation: 0,
//               color: Colors.deepPurple,
//               onPressed: () async {
//                 // if (formKey.currentState!.validate()) {
//                 //   // Aquí puedes realizar acciones con los datos del formulario

//                 final image = await keySignaturePad.currentState?.toImage();
//                 final ByteData? imageSignature =
//                     await image!.toByteData(format: ImageByteFormat.png);
//                 Uint8List bytes = imageSignature!.buffer.asUint8List();
//                 String imgBase64String = base64Encode(bytes);
//                 keySignaturePad.currentState?.clear();

//                 //   print('x: ${startPoint?.dx}');
//                 //   print('y: ${startPoint?.dy}');
//                 //   print('nombre: ${nombreController.text}');
//                 //   print('correo: ${correoController.text}');
//                 //   print('telefono: ${telefonoController.text}');
//                 //   print('tipo documento: $dropdownValue');
//                 //   print('documento: ${numeroDocumentController.text}');

//                 try {
//                   const url =
//                       'https://bkr0z0nhpd.execute-api.us-west-2.amazonaws.com/lawyer-develop/pdfsignature';
//                   final body = jsonEncode({
//                     "signature": {
//                       "x": 250,
//                       "y": 471.15625,
//                       "name": "John Doe",
//                       "email": "john_doe@abc.com",
//                       "phone": "24234",
//                       "document": {"number": "12345678", "type": "CC"}
//                     },
//                     "PDF": pdfBase64String,
//                     "Img": imgBase64String
//                   });

//                   final response = await http.post(
//                     Uri.parse(url),
//                     body: body,
//                   );
//                   Map<String, dynamic> jsonResponse = jsonDecode(response.body);

//                   List<int> bytesList = [];
//                   jsonResponse['body'].forEach((key, value) {
//                     bytesList.add(value);
//                   });

//                   Uint8List uint8List = Uint8List.fromList(bytesList);

//                   saveAndLaunchFile(uint8List, 'prueba');
//                 } catch (e) {
//                   print('error');
//                   print(e);
//                 }
//               },
//               child: Container(
//                 padding:
//                     const EdgeInsets.symmetric(horizontal: 80, vertical: 15),
//                 child: const Text(
//                   'Firmar',
//                   style: TextStyle(color: Colors.white),
//                 ),
//               ),
//             ),
//           )
//         ],
//       ),
//     );
//   }

//   Future<void> convertPdf() async {
//     FilePickerResult? myFile = await FilePicker.platform.pickFiles(
//       withData: true,
//       type: FileType.custom,
//       allowedExtensions: ['pdf'],
//     );

//     // bytes del pdf
//     Uint8List? fileBytes = myFile!.files.first.bytes;
//     pdfBase64String = base64Encode(fileBytes!);
//     final mimType = lookupMimeType(myFile.files.first.name,
//         headerBytes: myFile.files.first.bytes);

//     //crea uri del pdg como data:application/pdf;base64
//     setState(() {
//       uri = Uri.dataFromBytes(fileBytes, mimeType: mimType!).toString();
//     });
//   }
// }

// class Line {
//   final double x1;
//   final double y1;
//   final double x2;
//   final double y2;

//   Line(this.x1, this.y1, this.x2, this.y2);
// }


// class Rectangle {
//   final double width;
//   final double height;
//   final Offset position;

//   Rectangle(this.width, this.height, this.position);
// }
