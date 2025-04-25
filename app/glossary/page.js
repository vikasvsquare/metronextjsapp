'use client';

function Glossary() {
  return (
    <>
      <div className="sidebar-content ">
        <div className="container mx-auto p-6">
          <header className="mb-6">
            <h1 className="!text-3xl font-bold text-gray-900">Glossary</h1>
          </header>

          <section className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="!text-xl font-semibold text-gray-800 mb-4">Crime Statistics Overview</h2>
            <div className="space-y-4">
              <div>
                <h3 className="!text-lg font-semibold text-gray-700">Crime</h3>
                <p className="text-gray-600">Displays crime statistics</p>
              </div>
              <div>
                <h3 className="!text-lg font-semibold text-gray-700">Arrests</h3>
                <p className="text-gray-600">Displays the number of people arrested and demographics</p>
              </div>
              <div>
                <h3 className="!text-lg font-semibold text-gray-700">Calls for Service</h3>
                <p className="text-gray-600">
                  Displays the number of calls that law enforcement responded to, categorized by Routine, Priority, and Emergency
                </p>
              </div>
            </div>
          </section>

          <section className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="!text-xl font-semibold text-gray-800 mb-4">Crime Definitions</h2>

            <div className="space-y-6">
              <div>
                <h3 className="!text-lg font-semibold text-gray-700">Crimes Against Persons</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-600 !text-lg">Homicide</h4>
                    <p className="text-gray-600">
                      Murder and nonnegligent manslaughter: the willful (nonnegligent) killing of one human being by another.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-600 !text-lg">Rape</h4>
                    <p className="text-gray-600">
                      The penetration, no matter how slight, of the vagina or anus with any body part or object, or oral penetration by a
                      sex organ of another person, without the consent of the victim.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-600 !text-lg">Robbery</h4>
                    <p className="text-gray-600">
                      The taking or attempting to take anything of value from the care, custody, or control of a person or persons by force
                      or threat of force or violence and/or by putting the victim in fear.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-600 !text-lg">Aggravated Assault</h4>
                    <p className="text-gray-600">
                      An unlawful attack by one person upon another for the purpose of inflicting severe or aggravated bodily injury. This
                      type of assault usually is accompanied by the use of a weapon or by means likely to produce death or great bodily
                      harm. Simple assaults are excluded.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-600 !text-lg">Aggravated Assault on an Operator</h4>
                    <p className="text-gray-600">
                      An unlawful attack by one person upon another for the purpose of inflicting severe or aggravated bodily injury against
                      a bus or rail operator.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-600 !text-lg">Battery</h4>
                    <p className="text-gray-600">
                      Simple assaults, not aggravated, includes all assaults which do not involve the use of a firearm, knife, cutting
                      instrument, or other dangerous weapon and in which the victim did not sustain serious or aggravated injuries.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-600 !text-lg">Battery on an Operator</h4>
                    <p className="text-gray-600">
                      Simple assaults, not aggravated, includes all assaults which do not involve the use of a firearm, knife, cutting
                      instrument, or other dangerous weapon and in which the victim did not sustain serious or aggravated injuries, against
                      a bus or rail operator.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-600 !text-lg">Sex Offenses</h4>
                    <p className="text-gray-600">Sex crimes excluding rape. Examples are touching, grabbing, kissing without consent.</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="!text-lg font-semibold text-gray-700">Crimes Against Property</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-600 !text-lg">Arson</h4>
                    <p className="text-gray-600">
                      Any willful or malicious burning or attempt to burn, with or without intent to defraud, a dwelling house, public
                      building, motor vehicle or aircraft, personal property of another, etc.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-600 !text-lg">Bike Theft</h4>
                    <p className="text-gray-600">Theft of a bicycle.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-600 !text-lg">Burglary</h4>
                    <p className="text-gray-600">The unlawful entry of a structure to commit a felony or a theft.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-600 !text-lg">Larceny</h4>
                    <p className="text-gray-600">
                      The unlawful taking, carrying, leading, or riding away of property from the possession or constructive possession of
                      another.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-600 !text-lg">Motor Vehicle Theft</h4>
                    <p className="text-gray-600">The theft or attempted theft of a motor vehicle.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-600 !text-lg">Vandalism</h4>
                    <p className="text-gray-600">
                      To willfully or maliciously destroy, injure, disfigure, or deface any public or private property, real or personal,
                      without the consent of the owner or person having custody or control by cutting, tearing, breaking, marking, painting,
                      drawing, covering with filth, or any other such means as may be specified by local law.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="!text-lg font-semibold text-gray-700">Crimes Against Society</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-600 !text-lg">Narcotics</h4>
                    <p className="text-gray-600">Arrest due to possession of a narcotic substance.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-600 !text-lg">Trespassing</h4>
                    <p className="text-gray-600">Arrest due to entering premises without permission (e.g., without paying fare).</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-600 !text-lg">Weapons</h4>
                    <p className="text-gray-600">Arrest due to possession of a weapon such as a knife, dagger, gun, etc.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
export default Glossary;
