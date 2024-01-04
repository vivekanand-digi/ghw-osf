import React, { useContext } from "react";
import Styled from "@oracle-cx-commerce/react-components/styled";
/*
 * Uncomment the following line to get the parameter substitution
 * function, e.g. t(someParameterizedResourceString, "someValue").
 */
import { t } from "@oracle-cx-commerce/utils/generic";

import css from "./styles.css";

const GHWCopyright = (props) => {
  return (
    <Styled id="GHWCopyright" css={css}>
      <div className="main-cnr">
			
			<div className="title-section">
				<h1 className="h1">Copyright Infringement Notice</h1>
			</div>
			<div className="container-fixed">
				<div className="content-section">
					<div className="content">
						<h2 className="h2">COPYRIGHT INFRINGEMENT NOTICE</h2>
						<p className="para">
							We are committed to complying with U.S. copyright
							law and to responding to claims of copyright
							infringement. We will promptly process and
							investigate notices of alleged infringement and will
							take appropriate actions under the Digital
							Millennium Copyright Act, Title 17, United States
							Code, Section 512(c) (“DMCA”).Pursuant to the DMCA,
							notifications of claimed copyright infringement
							should be sent to a Service Provider’s Designated
							Agent. Notification must be submitted to the
							following Designated Agent for this site in the
							manner described below:
						</p>
					</div>

					<div className="content">
						<h2 className="h2">BY MAIL:</h2>
						<p className="para">Great HealthWorks GroupAttn:</p>
						<p className="para">
							Legal Department4150 SW 28th WayFort Lauderdale, FL
							33312
						</p>
					</div>
					<div className="content">
						<h2 className="h2">BY EMAIL:</h2>
						<p className="para">
						<a href="mailto:legal@greathealthworks.com">legal@greathealthworks.com</a>

						</p>
						<p className="para">
							For your complaint to be valid under the DMCA, you
							must provide all of the following information when
							providing notice of the claimed copyright
							infringement
						</p>
						<ol>
							<li>
								A physical or electronic signature of a person
								authorized to act on behalf of the copyright
								owner;
							</li>
							<li>
								Identification of the copyrighted work claimed
								to have been infringed;
							</li>
							<li>
								Identification of the material that is claimed
								to be infringing or to be the subject of the
								infringing activity and that is to be removed or
								access to which is to be disabled, as well as
								information reasonably sufficient to permit us
								to locate the material;
							</li>
							<li>
								Information reasonably sufficient to permit us
								to contact the copyright owner, such as an
								address, telephone number and, if available, an
								electronic mail address;
							</li>
							<li>
								A statement that you have a good faith belief
								that use of the material in the manner
								complained of is not authorized by the copyright
								owner, its agent or law; and
							</li>
							<li>
								A statement that the information in the
								notification is accurate and, under penalty of
								law, that you are authorized to act on behalf of
								the copyright owner.
							</li>
						</ol>
						<p className="para">
							For more details on the information required for
							valid notification, see 17 U.S.C. 512(c)(3).
						</p>
						<p className="para">
							You should be aware that, under the DMCA, claimants
							who make misrepresentations concerning copyright
							infringement may be liable for damages incurred as a
							result of the removal or blocking of the material,
							court costs and attorney fees.
						</p>
					</div>
				</div>
			</div>
		</div>
      
    </Styled>
  );
};

export default GHWCopyright;
