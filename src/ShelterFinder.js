import React, { useState, useEffect } from 'react';
import { getDistance, findNearest } from 'geolib';
import { Container, Typography, Card, CardContent, CircularProgress, useMediaQuery } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import HomeIcon from '@mui/icons-material/Home';
import axios from 'axios'
const shelters = [
  { id: 1, name: "Str. Baladei, nr. 1, bl. 12, sc. B", latitude: 47.672056, longitude: 26.276528, localitate: "Suceava" },
  { id: 2, name: "Str. Baladei, nr. 2, bl. 25, sc. C", latitude: 47.671889, longitude: 26.276889, localitate: "Suceava" },
  { id: 3, name: "Str. Baladei, nr. 4, bl. 16, sc. B", latitude: 47.672111, longitude: 26.276583, localitate: "Suceava" },
  { id: 4, name: "Str. Călimani, nr. 2, bl. 26, sc. A", latitude: 47.671980, longitude: 26.276830, localitate: "Suceava" },
  { id: 5, name: "Str. Calea Burdujeni, nr. 1, bl. 21, sc. C", latitude: 47.673722, longitude: 26.277444, localitate: "Suceava" },
  { id: 6, name: "Str. Celulozei, nr. 1, bl. 25, sc. F", latitude: 47.672583, longitude: 26.277889, localitate: "Suceava" },
  { id: 7, name: "Str. Celulozei, nr. 1, bl. 25, sc. H", latitude: 47.672028, longitude: 26.277290, localitate: "Suceava" },
  { id: 8, name: "Str. Celulozei, nr. 2, bl. 24, sc. E", latitude: 47.672840, longitude: 26.278110, localitate: "Suceava" },
  { id: 9, name: "Str. Celulozei, nr. 3, bl. 16, sc. E", latitude: 47.672500, longitude: 26.277500, localitate: "Suceava" },
  { id: 10, name: "Str. Celulozei, nr.7, bl.14, sc.A", latitude: 47.673167, longitude: 26.275194, localitate: "Suceava" },
  { id: 11, name: "Str. Mircea Damaschin, nr. 12, bl. 5, sc. A", latitude: 47.672889, longitude: 26.274278, localitate: "Suceava" },
  { id: 12, name: "Str. Mircea Damaschin, nr. 12, bl. 5, sc. C", latitude: 47.673333, longitude: 26.274917, localitate: "Suceava" },
  { id: 13, name: "Str. Rarău, nr. 1, bl. 13, sc. F", latitude: 47.673611, longitude: 26.275180, localitate: "Suceava" },
  { id: 14, name: "Str. Tineretului, nr. 2, bl. 33, sc. B", latitude: 47.671222, longitude: 26.279472, localitate: "Suceava" },
  { id: 15, name: "Str. Tineretului, nr. 4, bl. 36, sc. C", latitude: 47.670583, longitude: 26.280167, localitate: "Suceava" },
  { id: 16, name: "Str. Putna, nr. 10, bl. B 01, sc. A", latitude: 47.674722, longitude: 26.266667, localitate: "Suceava" },
  { id: 17, name: "Str. Putna, nr. 10, bl. B 01, sc. B", latitude: 47.674722, longitude: 26.266667, localitate: "Suceava" },
  { id: 18, name: "Str. Putna, nr. 14, bl. A 01, sc. A", latitude: 47.674222, longitude: 26.266361, localitate: "Suceava" },
  { id: 19, name: "Str. Putna, nr. 14, bl. A 01, sc. B", latitude: 47.674222, longitude: 26.266361, localitate: "Suceava" },
  { id: 20, name: "Str. Putna, nr. 8, bl. A 05, sc. A", latitude: 47.673944, longitude: 26.266056, localitate: "Suceava" },
  { id: 21, name: "Str. Putna, nr. 8, bl. A 05, sc. B", latitude: 47.673944, longitude: 26.266056, localitate: "Suceava" },
  { id: 22, name: "Str. Grigore Ureche, nr. 21, bl. 72, sc. A", latitude: 47.650000, longitude: 26.248889, localitate: "Suceava" },
  { id: 23, name: "Str. Stejarului, nr. 14, bl. 59, sc. B", latitude: 47.650389, longitude: 26.246583, localitate: "Suceava" },
  { id: 24, name: "Str. Stejarului, nr. 8, bl. 68, sc. A", latitude: 47.650222, longitude: 26.246833, localitate: "Suceava" },
  { id: 25, name: "Str. Vişinilor, nr.3, bl.59, sc.A", latitude: 47.650500, longitude: 26.245833, localitate: "Suceava" },
  { id: 26, name: "Str. Zamca, nr. 25, bl. 63, sc. A", latitude: 47.650833, longitude: 26.246090, localitate: "Suceava" },
  { id: 27, name: "Aleea Venus, nr. 1, bl. E 111, sc. A", latitude: 47.644361, longitude: 26.242167, localitate: "Suceava" },
  { id: 28, name: "Aleea Venus, nr. 1, bl. E 111, sc. E", latitude: 47.643667, longitude: 26.241500, localitate: "Suceava" },
  { id: 29, name: "Bld. George Enescu, bl. E 66, sc. A", latitude: 47.645889, longitude: 26.241389, localitate: "Suceava" },
  { id: 30, name: "Aleea Lalelelor, nr. 15, bl. 105, sc. A", latitude: 47.642861, longitude: 26.237528, localitate: "Suceava" },
  { id: 31, name: "Aleea Lalelelor, nr. 15, bl. 105, sc. B", latitude: 47.643278, longitude: 26.237060, localitate: "Suceava" },
  { id: 32, name: "Aleea Lalelelor, nr. 15, bl. 105, sc. C", latitude: 47.643333, longitude: 26.237000, localitate: "Suceava" },
  { id: 33, name: "Str. Lazăr Vicol, nr. 11, bl. E 35, sc. A", latitude: 47.642333, longitude: 26.238639, localitate: "Suceava" },
  { id: 34, name: "Str. Lazăr Vicol, nr. 4, bl. 56, sc. A", latitude: 47.641889, longitude: 26.238917, localitate: "Suceava" },
  { id: 35, name: "Str. Lazăr Vicol, nr. 4, bl. 56, sc. B", latitude: 47.641861, longitude: 26.238389, localitate: "Suceava" },
  { id: 36, name: "Str. Lazăr Vicol, nr. 4, bl. 56, sc. C", latitude: 47.641556, longitude: 26.238056, localitate: "Suceava" },
  { id: 37, name: "Str. Lazăr Vicol, nr. 4, bl. 56, sc. D", latitude: 47.641417, longitude: 26.237889, localitate: "Suceava" },
  { id: 38, name: "Str. Lazăr Vicol, nr. 4, bl. 56, sc. E", latitude: 47.641167, longitude: 26.237722, localitate: "Suceava" },
  { id: 39, name: "Bld. Sofia Vicoveanca, nr. 1(S.C. Primagra S.R.L. Suceava)", latitude: 47.633278, longitude: 26.229833, localitate: "Suceava" },
  { id: 40, name: "Str. Scurtă, nr. 6 (Cămin 4 –Universitatea „Ştefan cel Mare”)", latitude: 47.640917, longitude: 26.241610, localitate: "Suceava" },
  { id: 41, name: "Bld. 1 Decembrie 1918, nr. 21(Centrul de dializă Fresenius Nephrocare)", latitude: 47.638310, longitude: 26.238900, localitate: "Suceava" },
  { id: 42, name: "Str. Energeticianului, nr. 1(S.C. Termica S.A. Suceava)", latitude: 47.651806, longitude: 26.296300, localitate: "Suceava" },
  { id: 43, name: "Str. Universităţii, nr. 52(CEC Bank Suceava)", latitude: 47.645350, longitude: 26.243680, localitate: "Suceava" },
  { id: 44, name: "Str. Tineretului, f.n. (bloc de locuinţe,S.C. Loyal Impex S.R.L. Suceava)", latitude: 47.670306, longitude: 26.280861, localitate: "Suceava" },
  { id: 45, name: "Str. Castanilor, nr. 2 (locuinţe colective,SC General Construct SRL)", latitude: 47.636528, longitude: 26.234222, localitate: "Suceava" },
  { id: 46, name: "Str. Mihai Viteazul, nr. 13 (locuinţe colective – SC General Construct SRL)", latitude: 47.643680, longitude: 26.255570, localitate: "Suceava" },
  { id: 47, name: "Str. Narciselor, nr. 29 (locuinţe colective – SC General Construct SRL)", latitude: 47.648600, longitude: 26.244830, localitate: "Suceava" },
  { id: 48, name: "Str. Ilie Ilaşcu, bl. D2, sc. A (locuinţe colective – SC General Construct SRL)", latitude: 47.654417, longitude: 26.246028, localitate: "Suceava" },
  { id: 49, name: "Str. Ilie Ilaşcu, bl. D4, sc. A (locuinţe colective – SC General Construct SRL)", latitude: 47.654301, longitude: 26.245935, localitate: "Suceava" },
  { id: 50, name: "Str. Izvor, f.n., bl. 3 A", latitude: 47.458722, longitude: 26.307750, localitate: "Fălticeni" },
  { id: 51, name: "Str. 2 Grăniceri, nr. 31, bl. 51, sc. A", latitude: 47.454210, longitude: 26.298010, localitate: "Fălticeni" },
  { id: 52, name: "Str. 2 Grăniceri, nr. 31, bl. 51, sc. B", latitude: 47.454240, longitude: 26.298060, localitate: "Fălticeni" },
  { id: 53, name: "Str. 2 Grăniceri, nr. 31, bl. 51, sc. C", latitude: 47.454250, longitude: 26.298030, localitate: "Fălticeni" },
  { id: 54, name: "Str. Bogdan Vodă, nr. 6", latitude: 47.842528, longitude: 25.918050, localitate: "Rădăuţi" },
  { id: 55, name: "Str. Piaţa Unirii, nr. 74", latitude: 47.844667, longitude: 25.916306, localitate: "Rădăuţi" },
  { id: 56, name: "Str. Crişan, bl. 30, sc. B", latitude: 47.554361, longitude: 25.894194, localitate: "Gura Humorului" },
  { id: 57, name: "Str. 1 mai, Sala Polivalentă", latitude: 47.552090, longitude: 25.895290, localitate: "Gura Humorului" },
  { id: 58, name: "Bld. Bucovina, nr. 41", latitude: 47.553417, longitude: 25.899639, localitate: "Gura Humorului" },
  { id: 59, name: "Str. Simion Florea Marian, nr. 2", latitude: 47.950333, longitude: 26.068222, localitate: "Siret" },
  { id: 60, name: "Str. Margareta Muşat, nr. 1 A, bl. 1 A, sc. A", latitude: 47.950917, longitude: 26.064960, localitate: "Siret" },
  { id: 61, name: "Str. Margareta Muşat, nr. 1 B, bl. 1 B, sc. B", latitude: 47.951000, longitude: 26.064830, localitate: "Siret" },
  { id: 62, name: "Str. Petru Muşat, nr. 26", latitude: 47.948167, longitude: 26.060194, localitate: "Siret" },
  { id: 63, name: "Str. Carpaţi, nr. 9", latitude: 47.949820, longitude: 26.058990, localitate: "Siret" },
  { id: 64, name: "Str. 28 Noiembrie, nr. 3 ", latitude: 47.951361, longitude: 26.066667, localitate: "Siret" },
  { id: 65, name: "Str. Poetului, bl. A24", latitude: 46.201391, longitude: 21.299273, localitate: "Arad" },
  { id: 66, name: "Str.Brezoianu, Bl.A34, Sc.A", latitude: 46.202551, longitude: 21.299377, localitate: "Arad" },
  { id: 67, name: "str.Poetului, Bl.A37, Sc.A", latitude: 46.197202, longitude: 21.303415, localitate: "Arad" },
  { id: 68, name: "str.Poetului, Bl.A37, Sc.B", latitude: 46.197202, longitude: 21.303415, localitate: "Arad" },
  { id: 69, name: "str.Brezoianu, nr.6, bl.A 49, Sc.A", latitude: 46.202485, longitude: 21.300433, localitate: "Arad" },
  { id: 70, name: "str.Stupilor, nr.4, Bl.A54, Sc.A", latitude: 46.201256, longitude: 21.300752, localitate: "Arad" },
  { id: 71, name: "str.Stupilor, nr.4, Bl.A54, Sc.B", latitude: 46.201256, longitude: 21.300752, localitate: "Arad" },
  { id: 72, name: "str.Stupilor, nr.4, Bl.A54, Sc.C", latitude: 46.201256, longitude: 21.300752, localitate: "Arad" },
  { id: 73, name: "str.Tribunul Andreica, nr.4, Bl.A60, Sc.A", latitude: 46.201301, longitude: 21.301084, localitate: "Arad" },
  { id: 74, name: "str.Tribunul Andreica, nr.4, Bl.A60, Sc.B", latitude: 46.201301, longitude: 21.301084, localitate: "Arad" },
  { id: 75, name: "str.Luchian, nr.23, Bl.17, Sc.B", latitude: 46.200847, longitude: 21.297820, localitate: "Arad" },
  { id: 76, name: "str.Luchian, nr.32, Bl.C2", latitude: 46.199607, longitude: 21.296406, localitate: "Arad" },
  { id: 77, name: "str.Luchian, nr.30, Bl.C1, Sc.B", latitude: 46.201102, longitude: 21.297080, localitate: "Arad" },
  { id: 78, name: "Aleea Tomis, nr.3, Bl.X1", latitude: 46.194658, longitude: 21.300205, localitate: "Arad" },
  { id: 79, name: "Aleea Tomis, nr.5, Bl.X2", latitude: 46.194160, longitude: 21.300228, localitate: "Arad" },
  { id: 80, name: "Aleea Tomis, nr.7, Bl.X3", latitude: 46.193884, longitude: 21.299900, localitate: "Arad" },
  { id: 81, name: "Aleea Dezna, Bl.X11, Sc.A", latitude: 46.193791, longitude: 21.296450, localitate: "Arad" },
  { id: 82, name: "Aleea Dezna, Bl.X11, Sc.B", latitude: 46.193791, longitude: 21.296450, localitate: "Arad" },
  { id: 83, name: "Aleea Dezna, Bl.X11, Sc.C", latitude: 46.193791, longitude: 21.296450, localitate: "Arad" },
  { id: 84, name: "str.Școalei, nr.5, Bl.X28", latitude: 46.192374, longitude: 21.300468, localitate: "Arad" },
  { id: 85, name: "str.Școalei, nr.6, Bl.X29", latitude: 46.189464, longitude: 21.301451, localitate: "Arad" },
  { id: 86, name: "str.Școalei, nr.1, Bl.X34/1, Sc.A", latitude: 46.192253, longitude: 21.300724, localitate: "Arad" },
  { id: 87, name: "str.Școalei, nr.1, Bl.X34/1, Sc.B", latitude: 46.192253, longitude: 21.300724, localitate: "Arad" },
  { id: 88, name: "str.Școalei, nr.17, Bl.X34/2, Sc.A", latitude: 46.192253, longitude: 21.300724, localitate: "Arad" },
  { id: 89, name: "str.Școalei, nr.17, Bl.X34/2, Sc.B", latitude: 46.192253, longitude: 21.300724, localitate: "Arad" },
  { id: 90, name: "Aleea Neptun, Bl.Y1", latitude: 46.193483, longitude: 21.303582, localitate: "Arad" },
  { id: 91, name: "Aleea Neptun, Bl.Y2", latitude: 46.193483, longitude: 21.303582, localitate: "Arad" },
  { id: 92, name: "Aleea Neptun, Bl.Y3", latitude: 46.193637, longitude: 21.302069, localitate: "Arad" },
  { id: 93, name: "str.Obedenaru, Bl.Y9/A, Sc.A", latitude: 46.192926, longitude: 21.302750, localitate: "Arad" },
  { id: 94, name: "str.Obedenaru, Bl.Y9/A, Sc.B", latitude: 46.192926, longitude: 21.302750, localitate: "Arad" },
  { id: 95, name: "str.Obedenaru, Bl.Y9/B, Sc.A", latitude: 46.192926, longitude: 21.302750, localitate: "Arad" },
  { id: 96, name: "str.Obedenaru, Bl.Y9/B, Sc.B", latitude: 46.192926, longitude: 21.302750, localitate: "Arad" },
  { id: 97, name: "Str. Obedenaru, nr.11, Bl.Y14, Sc.A", latitude: 46.192954, longitude: 21.303100, localitate: "Arad" },
  { id: 98, name: "Str. Obedenaru, nr.11, Bl.Y14, Sc.B", latitude: 46.192954, longitude: 21.303100, localitate: "Arad" },
  { id: 99, name: "Str. Obedenaru, nr.11, Bl.Y14, Sc.C", latitude: 46.192954, longitude: 21.303100, localitate: "Arad" },
  { id: 100, name: "str.Călărașilor, Bl.Z3, Sc.A", latitude: 46.197728, longitude: 21.300556, localitate: "Arad" },
  { id: 101, name: "str.Călărașilor, Bl.Z3, Sc.C", latitude: 46.197728, longitude: 21.300556, localitate: "Arad" },
  { id: 102, name: "str.Fulgerului, Bl.Z8, Sc.A", latitude: 46.195547, longitude: 21.303053, localitate: "Arad" },
  { id: 103, name: "str.Fulgerului, Bl.Z8, Sc.C", latitude: 46.195547, longitude: 21.303053, localitate: "Arad" },
  { id: 104, name: "str.Abrud, nr.104, Bl.116", latitude: 46.177731, longitude: 21.346685, localitate: "Arad" },
  { id: 105, name: "Aleea .Zorelelor, nr.3, Bl.119", latitude: 46.178521, longitude: 21.346188, localitate: "Arad" },
  { id: 106, name: "str.Abrud, nr.110, Bl.121", latitude: 46.178222, longitude: 21.345741, localitate: "Arad" },
  { id: 107, name: "str.Abrud, nr.96, Bl.126", latitude: 46.177994, longitude: 21.346169, localitate: "Arad" },
  { id: 108, name: "str.Abrud, nr.102, Bl.131", latitude: 46.177467, longitude: 21.347509, localitate: "Arad" },
  { id: 109, name: "str.Simion Popa, nr.12, Bl.138", latitude: 46.178811, longitude: 21.348816, localitate: "Arad" },
  { id: 110, name: "str.Mioriței, nr.4, Bl.140", latitude: 46.178688, longitude: 21.348365, localitate: "Arad" },
  { id: 111, name: "str.Mioriței, nr.5, Bl.142", latitude: 46.173768, longitude: 21.350420, localitate: "Arad" },
  { id: 112, name: "str.Simion Popa, Bl.146", latitude: 46.178501, longitude: 21.350217, localitate: "Arad" },
  { id: 113, name: "str.Simion Popa, Bl.146", latitude: 46.178501, longitude: 21.350217, localitate: "Arad" },
  { id: 114, name: "str.Simion Popa, Bl.153", latitude: 46.178038, longitude: 21.351971, localitate: "Arad" },
  { id: 115, name: "str.Abrud, nr.91, Bl.171", latitude: 46.176593, longitude: 21.350872, localitate: "Arad" },
  { id: 116, name: "str.Săvîrşin, Bl.174", latitude: 46.175534, longitude: 21.350981, localitate: "Arad" },
  { id: 117, name: "str.Mioriței, nr.55, Bl.200", latitude: 46.175595, longitude: 21.349856, localitate: "Arad" },
  { id: 118, name: "str.Mioriței, nr.53, Bl.202", latitude: 46.173364, longitude: 21.350679, localitate: "Arad" },
  { id: 119, name: "str.Abrud, nr.221, Bl.84", latitude: 46.176957, longitude: 21.353037, localitate: "Arad" },
  { id: 120, name: "str.Simion Popa, nr.28, Bl.224", latitude: 46.178909, longitude: 21.349032, localitate: "Arad" },
  { id: 121, name: "str.Voinicilor, nr.41, Bl.509", latitude: 46.171412, longitude: 21.353597, localitate: "Arad" },
  { id: 122, name: "str.Zalău, nr.7, Bl.517", latitude: 46.170554, longitude: 21.351757, localitate: "Arad" },
  { id: 123, name: "str.Sighișoarei, nr.3, Bl.530, Sc.A", latitude: 46.170752, longitude: 21.351334, localitate: "Arad" },
  { id: 124, name: "str.Sighișoarei, nr.2, Bl.539, Sc.B", latitude: 46.170590, longitude: 21.350523, localitate: "Arad" },
  { id: 125, name: "str.Batiștei, nr.1, Bl.556, Sc.B", latitude: 46.168600, longitude: 21.349717, localitate: "Arad" },
  { id: 126, name: "str.Nucet, nr.8, Bl.563, Sc.A", latitude: 46.168892, longitude: 21.350118, localitate: "Arad" },
  { id: 127, name: "str.Nucet, nr.10, Bl.564, Sc.B", latitude: 46.168748, longitude: 21.350876, localitate: "Arad" },
  { id: 128, name: "str.Nucet, nr.10, Bl.564, Sc.C", latitude: 46.168748, longitude: 21.350876, localitate: "Arad" },
  { id: 129, name: "str.Ciuhandru, Bl.1 ANL", latitude: 46.171076, longitude: 21.346364, localitate: "Arad" },
  { id: 130, name: "str.Ciuhandru, Bl.2 ANL", latitude: 46.170840, longitude: 21.346281, localitate: "Arad" },
  { id: 131, name: "str.Ciuhandru, Bl.3 ANL", latitude: 46.170646, longitude: 21.345470, localitate: "Arad" },
  { id: 132, name: "str.Ciuhandru, Bl.4 ANL", latitude: 46.170164, longitude: 21.345931, localitate: "Arad" },
  { id: 133, name: "str.Ciuhandru, Bl.5 ANL", latitude: 46.170351, longitude: 21.346288, localitate: "Arad" },
  { id: 134, name: "str.Ciuhandru, Bl.6 ANL", latitude: 46.170573, longitude: 21.346346, localitate: "Arad" },
  { id: 135, name: "str.Titulescu, Bl.1 ANL", latitude: 46.173899, longitude: 21.347431, localitate: "Arad" },
  { id: 136, name: "str.Titulescu, Bl.2 ANL", latitude: 46.173581, longitude: 21.347336, localitate: "Arad" },
  { id: 137, name: "str.Titulescu, Bl.3 ANL", latitude: 46.173327, longitude: 21.347532, localitate: "Arad" },
  { id: 138, name: "Piața Gării, Bl.1", latitude: 46.189421, longitude: 21.324074, localitate: "Arad" },
  { id: 139, name: "str.Horia, nr.10, Bl.H2, Sc.B", latitude: 46.176296, longitude: 21.316548, localitate: "Arad" },
  { id: 140, name: "str.Horia, nr.10, Bl.H3, Sc.D", latitude: 46.176289, longitude: 21.316730, localitate: "Arad" },
  { id: 141, name: "str.Horia, nr.10, Bl.H4, Sc.G", latitude: 46.176289, longitude: 21.316676, localitate: "Arad" },
  { id: 142, name: "str.Blajului, nr.4", latitude: 46.177250, longitude: 21.320686, localitate: "Arad" },
  { id: 143, name: "str.Condurașilor, Bl.84, Sc.B", latitude: 46.166284, longitude: 21.297258, localitate: "Arad" },
  { id: 144, name: "str.Condurașilor, Bl.84, Sc.C", latitude: 46.166262, longitude: 21.296625, localitate: "Arad" },
  { id: 145, name: "str. Frunzei, nr. 2", latitude: 46.141176, longitude: 21.336499, localitate: "Arad" },
  { id: 146, name: "SC ASTRA RAIL INDUSTRIES SRL (PRIVAT) Arad, Calea Aurel Vlaicu, 41-43", latitude: 46.189685, longitude: 21.319404, localitate: "Arad" },
  { id: 147, name: "SPITALUL JUDEȚEAN ARAD str.Spitalului, nr.1-3", latitude: 46.183748, longitude: 21.308519, localitate: "Arad" },
  { id: 148, name: "MAGAZIN COLUMBUS OERAȚIONAL MARKET str.Vasile Lucaciu, nr.4", latitude: 46.172609, longitude: 21.346231, localitate: "Arad" },
  { id: 149, name: "SC JOYSON ROMÂNIA SRL, str. III, Zona industriala Vest nr. 9", latitude: 46.208065, longitude: 21.246529, localitate: "Arad" },
  { id: 150, name: "GALERIA MALL ARAD-SC MERCURY CENTER SRL Calea Aurel Vlaicu, nr.225-235", latitude: 46.200953, longitude: 21.288133, localitate: "Arad" },
  { id: 151, name: "HOTEL MIKY SRL, Calea Radnei, nr.231", latitude: 46.175807, longitude: 21.365393, localitate: "Arad" },
  { id: 152, name: "PENNY – COMPLEX FORTUNA CENTER, str. Luchian, nr.1", latitude: 46.199981, longitude: 21.295311, localitate: "Arad" },
  { id: 153, name: "SC YAZAKY COMPONENT TECHNOLOGY SA, str.III -Zona Industrială Arad Vest nr.4", latitude: 46.211167, longitude: 21.256229, localitate: "Arad" },
  { id: 154, name: "Str.Reşiţa,Nr.65", latitude: 45.807398, longitude: 24.165973, localitate: "Sibiu" },
  { id: 155, name: "Str.Reşiţa,Nr.77", latitude: 45.807919, longitude: 24.166715, localitate: "Sibiu" },
  { id: 156, name: "Str.Reşiţa,Nr.83", latitude: 45.808125, longitude: 24.167112, localitate: "Sibiu" },
  { id: 157, name: "Str.Reşiţa,Nr.89", latitude: 45.808296, longitude: 24.167680, localitate: "Sibiu" },
  { id: 158, name: "Str.Reşiţa,Nr.95", latitude: 45.808502, longitude: 24.167968, localitate: "Sibiu" },
  { id: 159, name: "B-dul Vasile Milea, FN(Subsol pasaj-Mag.Dumbrava )", latitude: 45.790689, longitude: 24.149014, localitate: "Sibiu" },
  { id: 160, name: "Str. Lungă, nr. 62, bloc 103 C, scara B", latitude: 45.805931, longitude: 24.145103, localitate: "Sibiu" },
  { id: 161, name: "Hotel Ramada, Str. Emil Cioran, nr. 2", latitude: 45.790948, longitude: 24.147894, localitate: "Sibiu" },
  { id: 162, name: "Hotel My Continental, Calea Dumbrăvii,Nr.2-4", latitude: 45.789792, longitude: 24.149009, localitate: "Sibiu" },
  { id: 163, name: "Cămin studenţesc Academica, Str. Aurel Decei,Nr.1", latitude: 45.782741, longitude: 24.130326, localitate: "Sibiu" },
  { id: 164, name: "Centrul de Afaceri, Str. N Olahus, Nr.5", latitude: 45.783478, longitude: 24.146985, localitate: "Sibiu" },
  { id: 165, name: "Casa de Cultura ,,Ion Besoiu”, Str. E. Cioran, nr. 1", latitude: 45.790056, longitude: 24.147648, localitate: "Sibiu" },
  { id: 166, name: "Str.Bihorului, Nr.6", latitude: 45.789213, longitude: 24.134844, localitate: "Sibiu" },
  { id: 167, name: "Str.Bihorului, Nr.4", latitude: 45.789844, longitude: 24.134732, localitate: "Sibiu" },
  { id: 168, name: "Str.V. Aaron, Nr.20, scara C", latitude: 45.785664, longitude: 24.169898, localitate: "Sibiu" },
  { id: 169, name: "Str.V. Aaron, Nr.20, scara D", latitude: 45.785638, longitude: 24.169706, localitate: "Sibiu" },
  { id: 170, name: "Str. Calea Dumbrăvii , Bl.18", latitude: 45.786477, longitude: 24.153061, localitate: "Sibiu" },
  { id: 171, name: "Str. Calea Dumbrăvii , Bl.23", latitude: 45.786389, longitude: 24.153056, localitate: "Sibiu" },
  { id: 172, name: "Str. Ştrandului, Nr.6", latitude: 45.789920, longitude: 24.136180, localitate: "Sibiu" },
  { id: 173, name: "Str.Haţegului, Nr.1", latitude: 45.786111, longitude: 24.135833, localitate: "Sibiu" },
  { id: 174, name: "Str. Intrarea Siretului , bloc 6, scara A", latitude: 45.770608, longitude: 24.141421, localitate: "Sibiu" },
  { id: 175, name: "Str. Intrarea Siretului , bloc 6, scara B", latitude: 45.770730, longitude: 24.141130, localitate: "Sibiu" },
  { id: 176, name: "Str. Intrarea Siretului , bloc 6, scara C", latitude: 45.770820, longitude: 24.140930, localitate: "Sibiu" },
  { id: 177, name: "Str. Intrarea Siretului , bloc 6, scara D", latitude: 45.770890, longitude: 24.140680, localitate: "Sibiu" },
  { id: 178, name: "Str. Ştefleşti, bloc 2, scara A", latitude: 45.724830, longitude: 24.173180, localitate: "Sibiu" },
  { id: 179, name: "Str. Ştefleşti, bloc 2, scara B", latitude: 45.784120, longitude: 24.172980, localitate: "Sibiu" },
  { id: 180, name: "Str. Ştefleşti, bloc 2, scara C", latitude: 45.784020, longitude: 24.172790, localitate: "Sibiu" },
  { id: 181, name: "Str. Ştefleşti, bloc 2, scara D", latitude: 45.783910, longitude: 24.172580, localitate: "Sibiu" },
  { id: 182, name: "Str. Oaşa, bloc 6, sc A", latitude: 45.783047, longitude: 24.173128, localitate: "Sibiu" },
  { id: 183, name: "Str. Oaşa, bloc 6, sc B", latitude: 45.783035, longitude: 24.173063, localitate: "Sibiu" },
  { id: 184, name: "Str. Oaşa, bloc 6, sc C", latitude: 45.783000, longitude: 24.172880, localitate: "Sibiu" },
  { id: 185, name: "Str. Oaşa, bloc 8, sc A", latitude: 45.782920, longitude: 24.172690, localitate: "Sibiu" },
  { id: 186, name: "Str. Oaşa, bloc 8, sc B", latitude: 45.783396, longitude: 24.173459, localitate: "Sibiu" },
  { id: 187, name: "Str. Oaşa, bloc 8, sc C", latitude: 45.783277, longitude: 24.173319, localitate: "Sibiu" },
  { id: 188, name: "Str. Oaşa, bloc 10, sc A", latitude: 45.783780, longitude: 24.174226, localitate: "Sibiu" },
  { id: 189, name: "Str. Oaşa, bloc 10, sc B", latitude: 45.783641, longitude: 24.174037, localitate: "Sibiu" },
  { id: 190, name: "Str. Oaşa, bloc 10, sc C", latitude: 45.783520, longitude: 24.173890, localitate: "Sibiu" },
  { id: 191, name: "Staţia CF Sibiu , Piaţa 1 Decembrie 1918, Nr.1-6", latitude: 45.800355, longitude: 24.160922, localitate: "Sibiu" },
  { id: 192, name: "Sucursala BCR Sibiu, Str.Emil Cioran, Nr.1", latitude: 45.789676, longitude: 24.146909, localitate: "Sibiu" },
  { id: 193, name: "Sucursala BRD Sibiu, Str. G-ral Magheru, Nr.55", latitude: 45.799602, longitude: 24.158602, localitate: "Sibiu" },
  { id: 194, name: "SC Tursib SA str. Munchen, nr. 1", latitude: 45.797984, longitude: 24.089239, localitate: "Sibiu" },
  { id: 195, name: "Clădire birouri, str. Dr. Ştefan Stâncă, nr 2-6", latitude: 45.788860, longitude: 24.147760, localitate: "Sibiu" },
  { id: 196, name: "Promenada Mall, str. Lector, nr. 1-3", latitude: 45.797180, longitude: 24.162792, localitate: "Sibiu" },
  { id: 197, name: "Cladire birouri ,,Keep Calling”, şos. Alba Iulia, nr. 40", latitude: 45.792839, longitude: 24.134969, localitate: "Sibiu" },
  { id: 198, name: "Clădire birouri ,,Visma”, str. Ştrandului, nr. 2B", latitude: 45.792510, longitude: 24.133967, localitate: "Sibiu" },
  { id: 199, name: "Primărie, Str. C.Coposu nr.3", latitude: 46.162823, longitude: 24.346500, localitate: "Mediaş" },
  { id: 200, name: "Bloc ANL str. Sinaia nr. 1", latitude: 46.165254, longitude: 24.333324, localitate: "Mediaş" },
  { id: 201, name: "Bloc ANL str. Sinaia nr. 2", latitude: 46.164641, longitude: 24.331788, localitate: "Mediaş" },
  { id: 202, name: "SC Transgaz SA, Piaţa C. I. Motaş, Nr. 1", latitude: 46.154867, longitude: 24.340716, localitate: "Mediaş" },
  { id: 203, name: "Hotel Confort, Miercurea Sibiului, nr. 816", latitude: 45.907656, longitude: 23.738754, localitate: "Miercurea Sibiului" },
  { id: 204, name: "Hotel Helyos Ocna Sibiului, str. Bailor, nr. 22-24", latitude: 45.877341, longitude: 24.061096, localitate: "Ocna Sibiului" }

];
// Define an icon to use for the markers
const icon = new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });
 
  const ShelterFinder = () => {
    const [currentLocation, setCurrentLocation] = useState(null);
    const [locationDetails, setLocationDetails] = useState(null);
    const [nearestShelter, setNearestShelter] = useState(null);
  
    const isSmallScreen = useMediaQuery('(max-width:600px)');
    const isMediumScreen = useMediaQuery('(max-width:960px)');
  
    const fontSize = {
      title: isSmallScreen ? '1.5rem' : isMediumScreen ? '2rem' : '2.5rem',
      subtitle: isSmallScreen ? '1.2rem' : isMediumScreen ? '1.5rem' : '1.8rem',
      body: isSmallScreen ? '0.875rem' : isMediumScreen ? '1rem' : '1.125rem',
    };
  
    const fetchLocationDetails = async (latitude, longitude) => {
      try {
        const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
          params: {
            lat: latitude,
            lon: longitude,
            format: 'json',
          },
        });
        setLocationDetails(response.data);
      } catch (error) {
        console.error('Error fetching location details', error);
      }
    };
  
    useEffect(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setCurrentLocation({ latitude, longitude });
            fetchLocationDetails(latitude, longitude);
          },
          (error) => {
            console.error('Error getting location', error);
          }
        );
      }
    }, []);
  
    useEffect(() => {
      if (currentLocation) {
        const nearest = findNearest(currentLocation, shelters);
        setNearestShelter(nearest);
      }
    }, [currentLocation]);
  
    return (
      <Container maxWidth="sm" style={styles.container}>
        <div style={styles.headerContainer}>
          <HomeIcon style={styles.icon} />
          <Typography variant="h4" component="h1" style={{ ...styles.header, fontSize: fontSize.title }}>
            Shelter Finder App
          </Typography>
        </div>
        {currentLocation ? (
          <div>
            <Card style={styles.card}>
              <CardContent>
                {/* <Typography variant="body2" style={{ ...styles.location, fontSize: fontSize.body }}>
                  : latitude {currentLocation.latitude}, longitude {currentLocation.longitude}
                </Typography> */}
                {locationDetails && (
                  <Typography variant="body2" style={{ ...styles.location, fontSize: fontSize.body }}>
                    Locația curentă: {locationDetails.display_name}
                  </Typography>
                )}
                {nearestShelter ? (
                  <div>
                    <Typography variant="h6" component="h2" style={{ ...styles.subtitle, fontSize: fontSize.subtitle }}>
                      <b>Cel mai apropiat adăpost se află la:</b>
                    </Typography>
                    <Typography variant="body1" style={{ ...styles.address, fontSize: fontSize.body }}>
                      <li><i>Adresa :</i> <b style={styles.boldText}>{nearestShelter.name}, {nearestShelter.localitate}</b></li>
                    </Typography>
                    <Typography variant="body1" style={{ ...styles.distance, fontSize: fontSize.body }}>
                      <li><i>Distanța :</i> <b style={styles.boldText}>{(getDistance(currentLocation, nearestShelter) / 1000).toFixed(2)} km</b></li>
                    </Typography>
                  </div>
                ) : (
                  <Typography variant="body1" style={{ fontSize: fontSize.body }}>Se calculează cel mai apropiat adăpost...</Typography>
                )}
              </CardContent>
            </Card>
            <MapContainer center={[currentLocation.latitude, currentLocation.longitude]} zoom={13} style={styles.map}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={[currentLocation.latitude, currentLocation.longitude]} icon={icon}>
                <Popup>Locația ta curentă</Popup>
              </Marker>
              {nearestShelter && (
                <Marker position={[nearestShelter.latitude, nearestShelter.longitude]} icon={icon}>
                  <Popup>Cel mai apropiat adăpost</Popup>
                </Marker>
              )}
            </MapContainer>
          </div>
        ) : (
          <div style={styles.loadingContainer}>
            <CircularProgress />
            <Typography variant="body1" style={{ ...styles.loadingText, fontSize: fontSize.body }}>
              Se identifică locația ta...
            </Typography>
          </div>
        )}
      </Container>
    );
  };
  
  const styles = {
    container: {
      marginTop: '20px',
      padding: '20px',
      maxWidth: '100%',
    },
    headerContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '20px',
    },
    header: {
      marginLeft: '10px',
    },
    icon: {
      fontSize: '2.5rem',
    },
    card: {
      marginBottom: '20px',
    },
    location: {
      marginBottom: '10px',
    },
    subtitle: {
      marginBottom: '10px',
    },
    address: {
      color: 'green',
    },
    distance: {
      color: 'red',
    },
    boldText: {
      color: '#000',
    },
    map: {
      height: '400px',
      width: '100%',
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      height: '100vh',
    },
    loadingText: {
      marginTop: '10px',
    },
  };
  
  export default ShelterFinder;